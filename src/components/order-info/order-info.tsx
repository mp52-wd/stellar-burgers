import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients';
import { useDispatch } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { useState } from 'react';
import { TOrder } from '../../utils/types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const { ingredients, loading: ingredientsLoading } = useSelector(
    (state) => state.ingredients
  );
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (number) {
      setLoading(true);
      getOrderByNumberApi(Number(number))
        .then((response) => {
          if (response.success && response.orders.length > 0) {
            setOrderData(response.orders[0]);
          }
        })
        .catch((error) => {
          console.error('Ошибка загрузки заказа:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || ingredientsLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
