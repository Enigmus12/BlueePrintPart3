## Description

This project implements a **REST API** for the management of *Blueprints*, developed with **Spring Boot**.  
The application allows **creating, querying, and updating** through endpoints, ensuring consistency and security in a **concurrent** environment.

The API was designed following **clean architecture principles** and **concurrency best practices**, ensuring proper handling of multiple simultaneous requests.

---

## Main Features

- Full CRUD for **Blueprints**:
  - Create new blueprints (`POST`)
  - Query blueprints (`GET`)
  - Update blueprints (`PUT`)
  - **Delete blueprints (`DELETE`)**
- Filtering blueprints (by author or globally).
- Exception handling with appropriate HTTP status codes (`404`, `400`, `500`).
- Defensive copies to prevent uncontrolled modifications under concurrency.
- Compatible with **Postman**, `curl`, and automated tests.

### **Frontend Web Application** (New Implementation)
- **HTML5/CSS3/JavaScript** interface for blueprint management
- **Interactive Canvas** for blueprint visualization using HTML5 Canvas
- **Canvas Event Handling** with PointerEvent support (mouse and touch-screen compatible)
- **Click-to-Draw**: Add points to blueprints by clicking/tapping on canvas
- **Create New Blueprints**: Initialize empty blueprints with custom names
- **Save/Update Blueprints**: Persist changes to server using chained promises
- **Delete Blueprints**: Remove blueprints with confirmation and automatic refresh
- **Responsive Design** with Bootstrap 3.3.7
- **Modular JavaScript** architecture with switchable API backends
- **Real-time Drawing** of blueprints connecting points with consecutive lines
- **In-Memory State Management**: Track current blueprint without affecting server until save

---

## Technologies Used

- **Java 17**  
- **Spring Boot** (Web, Dependency Injection)  
- **Maven** (dependency management and build)  
- **JUnit 5** (unit testing)
- **jQuery 3.6.0** (DOM manipulation and AJAX)
- **Bootstrap 3.3.7** (CSS framework and responsive design)
- **WebJars** (frontend library management)
- **HTML5 Canvas** (graphic visualization)  

---

## Project Structure

```plaintext
src/main/java/
 └── edu.eci.arsw.blueprints
     ├── controllers/       # REST Controllers
     ├── model/             # Entities (Blueprint, Point, etc.)
     ├── persistence/       # Interfaces and repositories (thread-safe)
     ├── services/          # Business logic and filters
     └── App                # Main class

src/main/resources/
 ├── static/
 │   ├── index.html         # Main web application page
 │   └── js/
 │       ├── apimock.js     # Mock data module for testing
 │       ├── apiclient.js   # REST API client module
 │       └── app.js         # Main application controller
 └── application.properties # Spring Boot configuration
```

## Execution

1. Clone the repository:

git clone https://github.com/Enigmus12/-SpringBoot_REST_API_Blueprints_Part2.git

cd Parte2

2. Compile:

mvn clean install

3. Run:

mvn spring-boot:run

4. The API will be available at:

http://localhost:8080/blueprints

**Web Application Interface:**

http://localhost:8080/index.html

## Main Endpoints

1. Get all blueprints

GET http://localhost:8080/blueprints

2. Get all blueprints by an author

GET http://localhost:8080/blueprints/{author}

3. Get a specific blueprint

GET http://localhost:8080/blueprints/{author}/{bpname}

4. Create a new blueprint — there are two ways: from the console or Postman. From console:

    Invoke-WebRequest -Uri "http://localhost:8080/blueprints" `
    -Method POST `
    -Headers @{ "Content-Type"="application/json"; "Accept"="application/json" } `
    -Body '{"author":"carlos","name":"nuevoPlano","points":[{"x":1,"y":1},{"x":2,"y":2}]}'

From Postman:

    * Método: POST
    * URL: http://localhost:8080/blueprints
    * Headers:
        + Content-Type: application/json
        + Accept: application/json

    * Body → Raw → JSON:

    ```plaintext
    {
        "author": "carlos",
        "name": "nuevoPlano",
        "points": [
            {"x": 1, "y": 1},
            {"x": 2, "y": 2}
        ]
    }
    ```

5. Update an existing blueprint — two ways: from the terminal:

    Invoke-WebRequest -Uri "http://localhost:8080/blueprints/juan/plano1" `
    -Method PUT `
    -Headers @{ "Content-Type"="application/json"; "Accept"="application/json" } `
    -Body '{"author":"juan","name":"plano1","points":[{"x":10,"y":10},{"x":20,"y":20}]}'

And Postman: 

    * Método: PUT
    * URL: http://localhost:8080/blueprints/juan/plano1
    * Headers:
        + Content-Type: application/json
        + Accept: application/json

    * Body → Raw → JSON:

    ```plaintext
    {
    "author": "juan",
    "name": "plano1",
    "points": [
        { "x": 10, "y": 10 },
        { "x": 20, "y": 20 }
        ]
    }
    ```

6. **Delete a blueprint** — two ways: from the terminal:

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/blueprints/juan/plano1" -Method DELETE
```

And Postman:

    * Método: DELETE
    * URL: http://localhost:8080/blueprints/juan/plano1
    * Headers: (None required)
    * Body: (Empty)

## Frontend Web Application Features

### **Interactive Blueprint Visualization**
- **Author Search**: Enter author name to retrieve their blueprints
- **Blueprint Listing**: Table displaying blueprint names and point counts
- **Canvas Drawing**: Click "Open" to visualize blueprints on HTML5 Canvas
- **Point Connection**: Automatic line drawing between consecutive points
- **Total Points Calculation**: Real-time sum of all author's blueprint points

### **Canvas Interaction** 
- **PointerEvent Support**: Works with mouse, touch screens, and stylus
- **Fallback Compatibility**: Automatic detection and fallback to mousedown for older browsers
- **Click to Add Points**: Click anywhere on canvas to add points to the current blueprint
- **Real-time Redraw**: Canvas updates immediately after adding each point
- **Relative Coordinates**: Precise point placement using canvas-relative coordinates
- **Validation**: Only allows point addition when a blueprint is open

### **Blueprint Management**

#### **Create New Blueprint Button**
1. Click "Create new blueprint"
2. Enter blueprint name via prompt
3. Canvas clears automatically
4. Click on canvas to add points
5. Click "Save/Update" → Makes **POST** request to create blueprint
6. Subsequent saves → Makes **PUT** request to update

#### **Save/Update Button (Chained Promises)**
- **For New Blueprints**:
  ```
  POST → GET all blueprints → Update table & recalculate points
  ```
- **For Existing Blueprints**:
  ```
  PUT → GET all blueprints → Update table & recalculate points
  ```
- **Automatic State Management**: `isNewBlueprint` flag tracks creation vs update
- **Error Handling**: Centralized `.catch()` for all promise chain operations

#### **Delete Button (Chained Promises)** 
1. Click "Delete" on an open blueprint
2. Confirmation dialog appears
3. If confirmed:
   ```
   Clear Canvas → DELETE request → GET all blueprints → Update table & recalculate points
   ```
4. Removed blueprint disappears from table
5. Total points automatically recalculated

### **Modular JavaScript Architecture**
- **app.js**: Main controller with private state management
  - `currentBlueprint`: In-memory state for open blueprint
  - `isNewBlueprint`: Flag to differentiate POST vs PUT operations
  - Event handlers for canvas clicks (PointerEvent/mousedown)
- **apimock.js**: Test data module with sample blueprints
- **apiclient.js**: REST API client for real backend communication
  - `createBlueprint()`: POST request for new blueprints
  - `updateBlueprint()`: PUT request for updates
  - `deleteBlueprint()`: DELETE request for removal
- **Switchable APIs**: Change between mock and real data with one line:

```javascript
var api = apiclient; // Use REST API
// var api = apimock;  // Use mock data
```

### **Available Test Data**

**Mock Data (apimock.js):**
- `johnconnor`: house, gear, machine
- `maryweyland`: lock, antenna, circuit  
- `thomasanderson`: wheel, bridge
- `sarahconnor`: weapon, shield, fortress

**REST API Data:**
- `juan`: plano1, plano2
- `maria`: planoX
- `author2`: bp2

### **Bootstrap UI Components**
- **Responsive Layout**: Mobile-friendly design with grid system
- **Panel Organization**: Organized interface with search, visualization, and results
- **Interactive Elements**: Buttons with Glyphicons and hover effects
- **Alert Components**: Status indicators and totals display

## CONCURRENCY_ANALYSIS Part III

### 1. Description of the concurrency problem
The BlueprintsRESTAPI component handles concurrent requests (multiple threads). The original implementation used a non-thread-safe HashMap and compound operations (query + modify) on mutable objects stored in the collection. This led to race conditions when:
 - **Registering (POST)** a new blueprint: two concurrent requests with the same author+name could both pass the existence check and insert, generating duplicates or inconsistencies.

 - **Updating (PUT)** a blueprint: the previous implementation fetched the stored object and mutated it (clear + addAll). If two threads updated the same blueprint simultaneously, operations interleaved and data was lost.

 - **Deleting (DELETE)** a blueprint: concurrent delete operations could cause inconsistent state if not handled atomically.

 - Concurrent reads while writes occurred could expose intermediate states (partially mutated objects).

### 2. Identified critical sections
 - The blueprints collection (map) itself — unprotected concurrent access.
 - The region "read object" + "modify object in memory" (in-place mutation of the points list).
 - Compound operations 'if-not-exists then put' (check-then-act) during save.
 - **Delete operations** requiring atomic removal and existence checking.

### 3. Solution applied
 - **Replaced HashMap with ConcurrentHashMap** (thread-safe collection).
 - Used **atomic operations** on the collection:
   * `putIfAbsent(key, value)` for insertions (avoids check-then-put race).
   * `computeIfPresent(key, remappingFunction)` for atomic updates by key (complete object replacement).
   * `remove(key)` returns null if element doesn't exist (atomic check-and-remove).
 - Avoided in-place mutations of stored objects: persistence stores/returns defensive copies (new Blueprint(...) from points). Updates replace the entire object (copy-on-write at object level).
 - **DELETE implementation**: Uses `ConcurrentHashMap.remove()` which atomically removes the entry and returns null if not found, preventing race conditions during deletion.
 - No global synchronization (e.g., synchronized methods) was applied to avoid performance degradation; all measures were aimed at allowing concurrency with per-key atomic operations.

### 4. Justification and evaluation
 - The solution prevents main race conditions since insert, update, and **delete** operations are no longer compound but atomic within the thread-safe collection.
 - Returning defensive copies prevents external consumers from mutating stored objects, eliminating another race source.
 - **DELETE operation** properly handles non-existent blueprints by throwing `BlueprintNotFoundException`, maintaining consistency.
 - According to course criteria: use of conditional atomic aggregation methods in the Thread-Safe collection → grade B.

### 5. Risks and future improvements
 - ConcurrentHashMap is sufficient for this lab. For production environments, consider:

    * Truly immutable objects (full immutability of Blueprint/Point),
    * Versioning validations (optimistic locking) if simultaneous edit control is required,
    * Persisting in a transactional database to guarantee durability and consistency across nodes,
    * **Soft deletes**: Instead of permanent deletion, mark blueprints as deleted with timestamps for audit trails.



## Author
    Juan David Rodríguez
    Escuela Colombiana de Ingeniería Julio Garavito.
