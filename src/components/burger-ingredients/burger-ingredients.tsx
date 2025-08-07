import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const constructorIngredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const constructorBun = useSelector((state) => state.burgerConstructor.bun);

  const buns = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === 'bun'),
    [ingredients]
  );
  const mains = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === 'main'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === 'sauce'),
    [ingredients]
  );

  // Подсчет количества ингредиентов в конструкторе
  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    // Подсчитываем начинки и соусы
    constructorIngredients.forEach((ingredient: any) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });

    // Подсчитываем булку
    if (constructorBun) {
      counters[constructorBun._id] = 2; // Булка всегда считается как 2
    }

    return counters;
  }, [constructorIngredients, constructorBun]);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      ingredientsCounters={ingredientsCounters}
    />
  );
};
