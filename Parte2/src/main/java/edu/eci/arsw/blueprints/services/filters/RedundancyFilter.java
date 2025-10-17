package edu.eci.arsw.blueprints.services.filters;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;


/** 
 *  @author Juan David Rodriguez
 */


/**
 * Filter (A): removes consecutive identical points
 */

@Component
@Primary // <--- if you want this filter to be the default one.
// To switch to the other filter, remove this @Primary and put it on SubsamplingFilter.
public class RedundancyFilter implements BlueprintFilter {

    @Override
    public Blueprint filter(Blueprint bp) {
        List<Point> src = bp.getPoints();
        List<Point> filtered = new ArrayList<>();
        Point prev = null;
        for (Point p : src) {
            if (prev == null || p.getX() != prev.getX() || p.getY() != prev.getY()) {
                filtered.add(new Point(p.getX(), p.getY()));
            }
            prev = p;
        }
        Blueprint nbp = new Blueprint(bp.getAuthor(), bp.getName());
        for (Point p : filtered) nbp.addPoint(p);
        return nbp;
    }
}
