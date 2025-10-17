package edu.eci.arsw.blueprints.test.services.filters;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.services.filters.SubsamplingFilter;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * @author Juan David Rodriguez
 */

public class SubsamplingFilterTest {

    @Test
    public void testFilterKeepsEvenIndexedPoints() {
        Point[] points = new Point[]{
            new Point(0, 0), // índice 0 (se queda)
            new Point(1, 1), // índice 1 (se elimina)
            new Point(2, 2), // índice 2 (se queda)
            new Point(3, 3), // índice 3 (se elimina)
            new Point(4, 4)  // índice 4 (se queda)
        };
        Blueprint bp = new Blueprint("juan", "subsamplingTest", points);

        SubsamplingFilter filter = new SubsamplingFilter();
        Blueprint filtered = filter.filter(bp);

        assertEquals("Debe quedarse solo con índices pares", 3, filtered.getPoints().size());

        assertEquals(0, filtered.getPoints().get(0).getX());
        assertEquals(0, filtered.getPoints().get(0).getY());

        assertEquals(2, filtered.getPoints().get(1).getX());
        assertEquals(2, filtered.getPoints().get(1).getY());

        assertEquals(4, filtered.getPoints().get(2).getX());
        assertEquals(4, filtered.getPoints().get(2).getY());
    }
}
