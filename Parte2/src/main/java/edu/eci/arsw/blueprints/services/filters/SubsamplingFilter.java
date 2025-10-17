package edu.eci.arsw.blueprints.services.filters;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;


/** 
 *  @author Juan David Rodriguez
 */

/**
 * Filter (B): removes 1 of every 2 points (keeps even indices)
 */

@Component

public class SubsamplingFilter implements BlueprintFilter {

    @Override
    public Blueprint filter(Blueprint bp) {
        List<Point> src = bp.getPoints();
        List<Point> filtered = new ArrayList<>();
        for (int i=0;i<src.size();i++){
            if (i % 2 == 0) {
                Point p = src.get(i);
                filtered.add(new Point(p.getX(), p.getY()));
            }
        }
        Blueprint nbp = new Blueprint(bp.getAuthor(), bp.getName());
        for (Point p : filtered) nbp.addPoint(p);
        return nbp;
    }
}
