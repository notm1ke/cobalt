import { Button } from '~/components/ui/button';
import { useFavorites } from '../DiningFavorites';
import { DiningHallResponse } from '@ilefa/blueplate';

export const RandomFavoriteExperiment: React.FC<{ menus?: DiningHallResponse[] }> = ({ menus }) => {
    const [favorites, dispatch] = useFavorites();

    if (!menus) return (
        <p>Loading...</p>
    );

    const favoriteRandomFoodItem = () => {
        let stations = menus.flatMap(menu => menu.meals.flatMap(meal => meal.stations));
        let items = stations.map(station => station.options).flat();
        // pick a random item from the list
        let randomItem = items[Math.floor(Math.random() * items.length)];
        dispatch({ type: 'add', payload: randomItem });
    }

    return (
        <>
            <span className="font-bold">Favorites Experiment</span>
            <ul>
                {favorites.map((favorite, i) => (
                    <li
                        key={i}
                        className="list-none cursor-pointer"
                        onClick={() => dispatch({ type: 'remove', payload: favorite })}
                    >
                        {favorite}
                    </li>
                ))}
            </ul>
            
            <Button className="mt-3" onClick={favoriteRandomFoodItem}>
                Favorite Random Food Item
            </Button>
        </>
    )
}