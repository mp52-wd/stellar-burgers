import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import {
  fetchOrders,
  ordersSelector,
  ordersLoadingSelector,
  ordersErrorSelector
} from '../../services/slices/orders';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(ordersSelector);
  const loading = useSelector(ordersLoadingSelector);
  const error = useSelector(ordersErrorSelector);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Необходимо авторизоваться для просмотра заказов</div>;
  }

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders || []} />;
};
