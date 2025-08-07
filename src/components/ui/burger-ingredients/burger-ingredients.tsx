import React, { FC, memo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';

import styles from './burger-ingredients.module.css';
import { BurgerIngredientsUIProps } from './type';
import { IngredientsCategory } from '@components';

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick,
    ingredientsCounters
  }) => (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab value='bun' active={currentTab === 'bun'} onClick={onTabClick}>
              Булки
            </Tab>
            <Tab
              value='main'
              active={currentTab === 'main'}
              onClick={onTabClick}
            >
              Начинки
            </Tab>
            <Tab
              value='sauce'
              active={currentTab === 'sauce'}
              onClick={onTabClick}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
        <div className={styles.content}>
          <IngredientsCategory
            title='Булки'
            titleRef={titleBunRef}
            ingredients={buns}
            ref={bunsRef}
            ingredientsCounters={ingredientsCounters}
          />
          <IngredientsCategory
            title='Начинки'
            titleRef={titleMainRef}
            ingredients={mains}
            ref={mainsRef}
            ingredientsCounters={ingredientsCounters}
          />
          <IngredientsCategory
            title='Соусы'
            titleRef={titleSaucesRef}
            ingredients={sauces}
            ref={saucesRef}
            ingredientsCounters={ingredientsCounters}
          />
        </div>
      </section>
    </>
  )
);
