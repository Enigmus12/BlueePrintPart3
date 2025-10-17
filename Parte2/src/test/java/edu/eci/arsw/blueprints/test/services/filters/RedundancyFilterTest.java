package edu.eci.arsw.blueprints.test.services.filters;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.services.filters.RedundancyFilter;
import org.junit.Test;
import static org.junit.Assert.*;


/**
 * @author Juan David Rodriguez
 */
public class RedundancyFilterTest {

    @Test
    public void testFilterRemovesConsecutiveDuplicates() {
        Point[] points = new Point[]{
            new Point(0, 0),
            new Point(0, 0),  // duplicado consecutivo
            new Point(1, 1),
            new Point(2, 2),
            new Point(2, 2)   // duplicado consecutivo
        };
        Blueprint bp = new Blueprint("juan", "redundancyTest", points);

        RedundancyFilter filter = new RedundancyFilter();
        Blueprint filtered = filter.filter(bp);

        assertEquals("Debe eliminar duplicados consecutivos", 3, filtered.getPoints().size());

        // Verificar que los puntos resultantes sean los correctos
        assertEquals(0, filtered.getPoints().get(0).getX());
        assertEquals(0, filtered.getPoints().get(0).getY());

        assertEquals(1, filtered.getPoints().get(1).getX());
        assertEquals(1, filtered.getPoints().get(1).getY());

        assertEquals(2, filtered.getPoints().get(2).getX());
        assertEquals(2, filtered.getPoints().get(2).getY());
    }
}
