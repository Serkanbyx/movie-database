import { FaHeart } from 'react-icons/fa';
import { LIST_TYPES } from '../utils/constants';
import ListPageContent from '../components/ui/ListPageContent';

const FavoritesPage = () => (
  <ListPageContent
    listType={LIST_TYPES.FAVORITE}
    icon={FaHeart}
    iconColor="text-red-500"
    title="My Favorites"
    emptyTitle="No favorites yet"
    emptyMessage="Start adding movies you love!"
    listName="favorites"
  />
);

export default FavoritesPage;
