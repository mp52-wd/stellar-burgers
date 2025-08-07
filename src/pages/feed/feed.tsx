import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import {
  fetchFeeds,
  feedsSelector,
  feedsLoadingSelector,
  feedsErrorSelector
} from '../../services/slices/feeds';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feeds = useSelector(feedsSelector);
  const loading = useSelector(feedsLoadingSelector);
  const error = useSelector(feedsErrorSelector);

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
