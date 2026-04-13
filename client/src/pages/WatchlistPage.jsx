import { FaBookmark } from 'react-icons/fa';
import { LIST_TYPES } from '../utils/constants';
import ListPageContent from '../components/ui/ListPageContent';

const WatchlistPage = () => (
  <ListPageContent
    listType={LIST_TYPES.WATCHLIST}
    icon={FaBookmark}
    iconColor="text-primary"
    title="My Watchlist"
    emptyTitle="Your watchlist is empty"
    emptyMessage="Add movies you want to watch later!"
    listName="watchlist"
  />
);

export default WatchlistPage;
