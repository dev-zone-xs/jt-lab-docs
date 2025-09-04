import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'JT-Lib - Торговые библиотеки',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Мощная библиотека для создания торговых стратегий с поддержкой индикаторов, 
        управления ордерами, работы с рыночными данными и системой событий.
      </>
    ),
    link: '/docs/jt-lib/core-fundamentals',
  },
  {
    title: 'JT-Trader - Торговая платформа',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Полнофункциональная торговая платформа с тестером стратегий, 
        runtime-окружением и удобным интерфейсом для разработки и тестирования.
      </>
    ),
    link: '/docs/jt-trader/010-getting-started',
  },
  {
    title: 'Технические индикаторы',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Встроенная система технических индикаторов: RSI, SMA, ATR и другие. 
        Легкая интеграция с буферами свечей и автоматическое обновление.
      </>
    ),
    link: '/docs/jt-lib/technical-indicators',
  },
  {
    title: 'Управление ордерами',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        OrdersBasket для управления торговыми операциями с поддержкой 
        различных типов ордеров, стоп-лоссов и тейк-профитов.
      </>
    ),
    link: '/docs/jt-lib/exchange-orders-basket',
  },
  {
    title: 'Рыночные данные',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Эффективная работа с историческими и реальными рыночными данными. 
        Буферизация свечей с автоматическим обновлением и кэшированием.
      </>
    ),
    link: '/docs/jt-lib/market-data-candles',
  },
  {
    title: 'Система событий',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        EventEmitter для управления событиями в торговых стратегиях. 
        Подписка на тики, изменения цен и другие торговые события.
      </>
    ),
    link: '/docs/jt-lib/events-system',
  },
];

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link
          className={clsx("button button--secondary button--outline", styles.featureButton)}
          to={link}>
          Подробнее →
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
