package edu.eci.arsw.blueprints.services;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import edu.eci.arsw.blueprints.services.filters.BlueprintFilter;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Juan David Rodriguez
 */


/**
 * service class for managing blueprints
 */

@Service
public class BlueprintsServices {

    @Autowired
    BlueprintsPersistence bpp = null;

    @Autowired
    BlueprintFilter bpf = null;

    public void addNewBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        bpp.saveBlueprint(bp);
    }

    public Set<Blueprint> getAllBlueprints() {
        Set<Blueprint> all = bpp.getAllBlueprints();
        return bpf.filter(all);
    }

    public Blueprint getBlueprint(String author,String name) throws BlueprintNotFoundException {
        Blueprint bp = bpp.getBlueprint(author, name);
        return bpf.filter(bp);
    }

    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> s = bpp.getBlueprintsByAuthor(author);
        return bpf.filter(s);
    }

    public void updateBlueprint(String author, String name, Blueprint newBp) throws BlueprintNotFoundException {
        bpp.updateBlueprint(author, name, newBp);
    }

    public void deleteBlueprint(String author, String name) throws BlueprintNotFoundException {
        bpp.deleteBlueprint(author, name);
    }

}

