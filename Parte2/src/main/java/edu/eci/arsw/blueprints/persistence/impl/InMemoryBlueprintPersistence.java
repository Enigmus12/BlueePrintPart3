package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import java.util.HashSet;
import java.util.Set;
import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Repository;


/**
 *
 * @author Juan David Rodriguez
 */

/**
 * In-memory implementation of the blueprint persistence interface. 
 * This class is a simple implementation that stores blueprints 
 * in the application's memory.
 */

@Repository
public class InMemoryBlueprintPersistence implements BlueprintsPersistence {

    // Changed to ConcurrentHashMap for thread-safety
    private final ConcurrentMap<Tuple<String,String>,Blueprint> blueprints = new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {
        // load some stub data (you already had several); keep them here
        Point[] pts1 = new Point[]{new Point(140, 140), new Point(115, 115), new Point(115,115)};
        Blueprint bp1 = new Blueprint("_authorname_", "_bpname_", pts1);
        blueprints.put(new Tuple<>(bp1.getAuthor(),bp1.getName()), bp1);

        Point[] pts2 = new Point[]{new Point(10,10), new Point(20,20), new Point(30,30), new Point(40,40)};
        Blueprint bp2 = new Blueprint("author2", "bp2", pts2);
        blueprints.put(new Tuple<>(bp2.getAuthor(),bp2.getName()), bp2);

        // New blueprints
        Point[] pts3 = new Point[]{ new Point(0,0), new Point(50,50), new Point(100,100) };
        Blueprint bp3 = new Blueprint("juan", "plano1", pts3);
        blueprints.put(new Tuple<>(bp3.getAuthor(), bp3.getName()), bp3);

        Point[] pts4 = new Point[]{ new Point(10,0), new Point(20,10), new Point(30,20) };
        Blueprint bp4 = new Blueprint("juan", "plano2", pts4);
        blueprints.put(new Tuple<>(bp4.getAuthor(), bp4.getName()), bp4);

        Point[] pts5 = new Point[]{ new Point(5,5), new Point(15,15), new Point(25,25) };
        Blueprint bp5 = new Blueprint("maria", "planoX", pts5);
        blueprints.put(new Tuple<>(bp5.getAuthor(), bp5.getName()), bp5);
    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        Tuple<String,String> key = new Tuple<>(bp.getAuthor(), bp.getName());
        // use putIfAbsent to avoid race condition of double insertion
        Blueprint prev = blueprints.putIfAbsent(key, bp);
        if (prev != null) {
            throw new BlueprintPersistenceException("The given blueprint already exists: " + bp);
        }
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        Blueprint bp = blueprints.get(new Tuple<>(author, bprintname));
        if (bp == null) {
            throw new BlueprintNotFoundException("Blueprint not found: " + author + ", " + bprintname);
        }
        // return a defensive copy to prevent the caller from modifying the shared object
        return copyBlueprint(bp);
    }

    @Override
    public Set<Blueprint> getAllBlueprints() {
        // snapshot of values and return defensive copies
        Collection<Blueprint> vals = blueprints.values();
        Set<Blueprint> res = new HashSet<>();
        for (Blueprint bp : vals) {
            res.add(copyBlueprint(bp));
        }
        return res;
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> r = new HashSet<>();
        for (Blueprint bp : blueprints.values()) {
            if (bp.getAuthor().equals(author)) {
                r.add(copyBlueprint(bp));
            }
        }
        if (r.isEmpty()) {
            throw new BlueprintNotFoundException("No blueprints found for author: " + author);
        }
        return r;
    }

    @Override
    public void updateBlueprint(String author, String bprintname, Blueprint newBp) throws BlueprintNotFoundException {
        Tuple<String,String> key = new Tuple<>(author, bprintname);
        // Use computeIfPresent to replace atomically
        Blueprint result = blueprints.computeIfPresent(key, (k, old) -> {
            // validate that newBp has the same author/name
            return new Blueprint(newBp.getAuthor(), newBp.getName(), newBp.getPoints().toArray(new Point[0]));
        });
        if (result == null) {
            throw new BlueprintNotFoundException("Blueprint not found: " + author + "/" + bprintname);
        }
    }

    @Override
    public void deleteBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        Tuple<String,String> key = new Tuple<>(author, bprintname);
        Blueprint removed = blueprints.remove(key);
        if (removed == null) {
            throw new BlueprintNotFoundException("Blueprint not found: " + author + "/" + bprintname);
        }
    }

    // helper to create defensive copy
    private Blueprint copyBlueprint(Blueprint bp) {
        Point[] pts = bp.getPoints().toArray(new Point[0]);
        return new Blueprint(bp.getAuthor(), bp.getName(), pts);
    }
}
