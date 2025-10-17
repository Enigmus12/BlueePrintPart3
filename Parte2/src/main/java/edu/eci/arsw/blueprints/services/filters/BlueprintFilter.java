package edu.eci.arsw.blueprints.services.filters;

import edu.eci.arsw.blueprints.model.Blueprint;
import java.util.Set;

/**
 *
 * @author Juan David Rodriguez
 */

/** 
 * Interface for filtering blueprints.
 */

    public interface BlueprintFilter {

        // filters a blueprint, returning a new blueprint
        Blueprint filter(Blueprint bp);

        // filters a set of blueprints
        default Set<Blueprint> filter(Set<Blueprint> bps){
            Set<Blueprint> res = new java.util.HashSet<>();
            for (Blueprint bp : bps) {
                res.add(filter(bp));
            }
            return res;
        }

    }
