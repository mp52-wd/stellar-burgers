import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feeds';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { feeds, loading } = useSelector((state) => state.feeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading || !feeds) {
    return <Preloader />;
  }

  return <FeedUI orders={feeds.orders} handleGetFeeds={handleGetFeeds} />;
};
