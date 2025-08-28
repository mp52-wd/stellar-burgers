import { Preloader } from '@ui';
import { FeedUI, OrderInfo } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  fetchFeeds,
  feedsSelector,
  feedsLoadingSelector,
  feedsErrorSelector
} from '../../services/slices/feeds';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const feeds = useSelector(feedsSelector);
  const loading = useSelector(feedsLoadingSelector);
  const error = useSelector(feedsErrorSelector);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  // Если указан номер заказа, отображаем конкретный заказ
  if (number) {
    if (loading || !feeds) {
      return <Preloader />;
    }
    
    const order = feeds.orders.find(order => order.number.toString() === number);
    if (!order) {
      return <div>Заказ не найден</div>;
    }
    
    return <OrderInfo orderInfo={order} />;
  }

  // Иначе отображаем ленту заказов
  if (loading || !feeds) {
    return <Preloader />;
  }

  return <FeedUI orders={feeds.orders} handleGetFeeds={handleGetFeeds} />;
};
