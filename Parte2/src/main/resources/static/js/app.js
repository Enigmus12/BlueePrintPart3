var app = (function () {

    
    var selectedAuthor = "";
    var blueprintsList = [];
    // Estado del blueprint actualmente abierto en el canvas
    // { author: string, name: string, points: [{x:number, y:number}] }
    var currentBlueprint = null;
    // Bandera para saber si estamos creando un nuevo blueprint o editando uno existente
    var isNewBlueprint = false;
    
    // Configuración del API - cambiar entre apimock y apiclient con una línea
    var api = apiclient; 

    // Función privada para calcular el total de puntos
    var calculateTotalPoints = function (blueprints) {
        return blueprints.reduce(function (total, blueprint) {
            return total + blueprint.points;
        }, 0);
    };

    // Función privada para limpiar la tabla
    var clearTable = function () {
        $("#blueprintsTableBody").empty();
    };

    // Función privada para limpiar el canvas
    var clearCanvas = function () {
        var canvas = document.getElementById("blueprintCanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        $("#currentBlueprintName").text("None selected");
        // Reiniciar el estado del blueprint actual
        currentBlueprint = null;
        isNewBlueprint = false;
    };

    // Función privada para dibujar en el canvas
    var drawBlueprint = function (points, blueprintName) {
        var canvas = document.getElementById("blueprintCanvas");
        var ctx = canvas.getContext("2d");
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!points || points.length === 0) {
            $("#currentBlueprintName").text("No points to draw");
            return;
        }
        
        // Configurar el estilo de dibujo
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        // Comenzar el path
        ctx.beginPath();
        
        // Mover al primer punto
        ctx.moveTo(points[0].x, points[0].y);
        
        // Dibujar líneas consecutivas a cada punto
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        // Ejecutar el dibujo
        ctx.stroke();
        
        // Dibujar puntos como círculos
        ctx.fillStyle = "#dc3545";
        for (var j = 0; j < points.length; j++) {
            ctx.beginPath();
            ctx.arc(points[j].x, points[j].y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Actualizar el nombre del plano actual
        $("#currentBlueprintName").text(blueprintName);
    };

    var updateDOM = function (author, blueprints) {
        $("#selectedAuthor").text(author);
        
        // Limpiar la tabla y canvas antes de agregar nuevos datos
        clearTable();
        clearCanvas();
        
        // Agregar cada blueprint a la tabla
        blueprints.forEach(function (blueprint) {
            var row = "<tr>" +
                      "<td class='text-center'>" + blueprint.name + "</td>" +
                      "<td class='text-center'>" + blueprint.points + "</td>" +
                      "<td class='text-center'>" +
                          "<button class='btn btn-success btn-sm open-blueprint' " +
                          "data-author='" + author + "' data-blueprint='" + blueprint.name + "'>" +
                          "<span class='glyphicon glyphicon-eye-open'></span> Open" +
                          "</button>" +
                      "</td>" +
                      "</tr>";
            $("#blueprintsTableBody").append(row);
        });
        
        // Calcular y mostrar el total de puntos
        var totalPoints = calculateTotalPoints(blueprints);
        $("#totalPoints").text(totalPoints);
    };

    return {
        setSelectedAuthor: function (author) {
            selectedAuthor = author;
        },

        getSelectedAuthor: function () {
            return selectedAuthor;
        },

        updateBlueprintsList: function (author) {
            selectedAuthor = author;
            
            api.getBlueprintsByAuthor(author, function (data) {
                // Validación para evitar errores
                if (data) {
                    // Aplicar map para convertir los elementos a objetos con solo nombre y número de puntos
                    blueprintsList = data.map(function (blueprint) {
                        return {
                            name: blueprint.name,
                            points: blueprint.points.length // número de puntos = longitud del array points
                        };
                    });
                    
                    updateDOM(author, blueprintsList);
                } else {
                    // Si no hay datos, limpiar la vista
                    blueprintsList = [];
                    updateDOM(author, []);
                }
            });
        },

        drawSpecificBlueprint: function (author, blueprintName) {
            api.getBlueprintsByNameAndAuthor(author, blueprintName, function (data) {
                if (data && data.points) {
                    // Guardar en memoria el blueprint actual (copia de puntos)
                    currentBlueprint = {
                        author: author,
                        name: blueprintName,
                        points: data.points.map(function (p) { return { x: p.x, y: p.y }; })
                    };
                    // Al abrir un blueprint existente, no es nuevo
                    isNewBlueprint = false;
                    // Dibujar el blueprint en el canvas
                    drawBlueprint(currentBlueprint.points, blueprintName);
                }
            });
        },

        getBlueprintsList: function () {
            return blueprintsList;
        },

        saveCurrentBlueprint: function () {
            // Verificar si hay un blueprint seleccionado
            if (!currentBlueprint) {
                alert("No hay ningún blueprint abierto para guardar");
                return;
            }

            var author = currentBlueprint.author;
            var blueprintName = currentBlueprint.name;
            var blueprintData = {
                author: author,
                name: blueprintName,
                points: currentBlueprint.points
            };

            // Decidir si hacer POST (crear) o PUT (actualizar) según la bandera
            var savePromise;
            
            if (isNewBlueprint) {
                // Es un blueprint nuevo - usar POST
                console.log("Creando nuevo blueprint...");
                savePromise = api.createBlueprint(author, blueprintName, blueprintData);
            } else {
                // Es un blueprint existente - usar PUT
                console.log("Actualizando blueprint existente...");
                savePromise = api.updateBlueprint(author, blueprintName, blueprintData);
            }

            // Encadenar las operaciones con promesas:
            // 1. POST/PUT para crear/actualizar el blueprint
            // 2. GET para obtener todos los blueprints del autor
            // 3. Recalcular puntos totales
            savePromise
                .then(function () {
                    console.log("Blueprint guardado correctamente");
                    // Después del primer guardado, ya no es nuevo
                    isNewBlueprint = false;
                    // Retornar una promesa para obtener todos los blueprints del autor
                    return new Promise(function (resolve, reject) {
                        api.getBlueprintsByAuthor(author, function (data) {
                            if (data) {
                                resolve(data);
                            } else {
                                reject("Error obteniendo blueprints");
                            }
                        });
                    });
                })
                .then(function (data) {
                    console.log("Blueprints obtenidos correctamente");
                    // Actualizar la lista de blueprints y recalcular puntos
                    blueprintsList = data.map(function (blueprint) {
                        return {
                            name: blueprint.name,
                            points: blueprint.points.length
                        };
                    });
                    updateDOM(author, blueprintsList);
                    alert("Blueprint guardado exitosamente");
                })
                .catch(function (error) {
                    console.error("Error en la operación:", error);
                    alert("Error al guardar el blueprint: " + error);
                });
        },

        createNewBlueprint: function () {
            // Solicitar el nombre del nuevo blueprint
            var blueprintName = prompt("Ingrese el nombre del nuevo blueprint:");
            
            // Validar que se haya ingresado un nombre
            if (!blueprintName || blueprintName.trim() === "") {
                alert("Debe ingresar un nombre válido para el blueprint");
                return;
            }
            
            // Verificar que haya un autor seleccionado
            if (!selectedAuthor || selectedAuthor.trim() === "") {
                alert("Debe seleccionar un autor primero (busque blueprints de un autor)");
                return;
            }
            
            // Limpiar el canvas
            var canvas = document.getElementById("blueprintCanvas");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Crear el nuevo blueprint en memoria (vacío, sin puntos)
            currentBlueprint = {
                author: selectedAuthor,
                name: blueprintName.trim(),
                points: []
            };
            
            // Marcar que es un blueprint nuevo
            isNewBlueprint = true;
            
            // Actualizar el nombre en la interfaz
            $("#currentBlueprintName").text(blueprintName.trim() + " (nuevo)");
            
            console.log("Nuevo blueprint creado:", currentBlueprint.name);
        },

        deleteCurrentBlueprint: function () {
            // Verificar si hay un blueprint seleccionado
            if (!currentBlueprint) {
                alert("No hay ningún blueprint seleccionado para eliminar");
                return;
            }
            
            // Verificar que no sea un blueprint nuevo sin guardar
            if (isNewBlueprint) {
                alert("Este blueprint aún no ha sido guardado. No hay nada que eliminar del servidor.");
                // Solo limpiamos el canvas
                clearCanvas();
                return;
            }
            
            // Confirmar la eliminación
            var confirmDelete = confirm("¿Está seguro que desea eliminar el blueprint '" + currentBlueprint.name + "'?");
            if (!confirmDelete) {
                return;
            }
            
            var author = currentBlueprint.author;
            var blueprintName = currentBlueprint.name;
            
            // Primero limpiar el canvas
            clearCanvas();
            
            // Encadenar las operaciones con promesas:
            // 1. DELETE para eliminar el blueprint
            // 2. GET para obtener los blueprints restantes del autor
            // 3. Actualizar la tabla y recalcular puntos
            api.deleteBlueprint(author, blueprintName)
                .then(function () {
                    console.log("Blueprint eliminado correctamente");
                    // Retornar una promesa para obtener todos los blueprints del autor
                    return new Promise(function (resolve, reject) {
                        api.getBlueprintsByAuthor(author, function (data) {
                            if (data) {
                                resolve(data);
                            } else {
                                // Si no hay datos, retornar array vacío (todos fueron eliminados)
                                resolve([]);
                            }
                        });
                    });
                })
                .then(function (data) {
                    console.log("Blueprints obtenidos correctamente");
                    // Actualizar la lista de blueprints y recalcular puntos
                    blueprintsList = data.map(function (blueprint) {
                        return {
                            name: blueprint.name,
                            points: blueprint.points.length
                        };
                    });
                    updateDOM(author, blueprintsList);
                    alert("Blueprint eliminado exitosamente");
                })
                .catch(function (error) {
                    console.error("Error al eliminar el blueprint:", error);
                    alert("Error al eliminar el blueprint. Por favor, intente nuevamente.");
                });
        },

        init: function () {
            // Asociar el evento click del botón principal
            $("#getBlueprintsBtn").click(function () {
                var author = $("#authorInput").val().trim();
                
                // Llamar a la función para actualizar los blueprints
                app.updateBlueprintsList(author);
            });

            // Asociar eventos de los botones "Open" usando delegación de eventos
            $(document).on("click", ".open-blueprint", function () {
                var author = $(this).data("author");
                var blueprintName = $(this).data("blueprint");
                
                // Llamar a la función para dibujar el blueprint específico
                app.drawSpecificBlueprint(author, blueprintName);
            });

            // Asociar el evento click del botón Save/Update
            $("#saveBlueprintBtn").click(function () {
                app.saveCurrentBlueprint();
            });

            // Asociar el evento click del botón Create New Blueprint
            $("#createBlueprintBtn").click(function () {
                app.createNewBlueprint();
            });

            // Asociar el evento click del botón Delete
            $("#deleteBlueprintBtn").click(function () {
                app.deleteCurrentBlueprint();
            });

            // Inicializar el manejador de eventos del canvas
            var canvas = document.getElementById("blueprintCanvas");
            
            // Verificar si el navegador soporta PointerEvent (eventos modernos para mouse y táctil)
            if (window.PointerEvent) {
                console.info('PointerEvent is supported');
                
                // Usar PointerEvent para capturar clicks (funciona con mouse y pantalla táctil)
                canvas.addEventListener("pointerdown", function (event) {
                    // Si no hay blueprint seleccionado, no hacer nada
                    if (!currentBlueprint) return;

                    // Obtener las coordenadas relativas al canvas
                    var rect = canvas.getBoundingClientRect();
                    var x = event.clientX - rect.left;
                    var y = event.clientY - rect.top;

                    // Agregar el punto en memoria y repintar
                    currentBlueprint.points.push({ x: x, y: y });
                    drawBlueprint(currentBlueprint.points, currentBlueprint.name);
                });
            } else {
                console.info('PointerEvent not supported, using mousedown instead');
                
                // Si PointerEvent no está soportado, usar mousedown (evento clásico)
                canvas.addEventListener("mousedown", function (event) {
                    // Si no hay blueprint seleccionado, no hacer nada
                    if (!currentBlueprint) return;

                    // Obtener las coordenadas relativas al canvas
                    var rect = canvas.getBoundingClientRect();
                    var x = event.clientX - rect.left;
                    var y = event.clientY - rect.top;

                    // Agregar el punto en memoria y repintar
                    currentBlueprint.points.push({ x: x, y: y });
                    drawBlueprint(currentBlueprint.points, currentBlueprint.name);
                });
            }
        }
    };

})();

$(document).ready(function () {
    app.init();
});