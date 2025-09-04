import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Начать изучение - 5мин ⏱️
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/quick-start">
            Быстрый старт 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickLinks() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--lg">
              <Heading as="h2">Быстрые ссылки</Heading>
              <p>Начните с основ или перейдите к конкретным разделам</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col--6">
            <div className="card">
              <div className="card__header">
                <h3>🚀 Быстрый старт</h3>
              </div>
              <div className="card__body">
                <p>Установка и настройка JT-Lib за 5 минут</p>
                <Link className="button button--primary" to="/docs/quick-start">
                  Начать сейчас
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--6">
            <div className="card">
              <div className="card__header">
                <h3>📚 Примеры кода</h3>
              </div>
              <div className="card__body">
                <p>Готовые примеры торговых стратегий и индикаторов</p>
                <Link className="button button--primary" to="/docs/examples-guide">
                  Смотреть примеры
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row margin-top--lg">
          <div className="col col--4">
            <div className="card">
              <div className="card__header">
                <h3>⚡ JT-Lib</h3>
              </div>
              <div className="card__body">
                <p>Торговые библиотеки и API</p>
                <div className="button-group">
                  <Link className="button button--secondary" to="/docs/jt-lib/core-fundamentals">
                    Документация
                  </Link>
                  <Link className="button button--outline button--secondary" href="https://github.com/jt-lab-com/jt-lib" target="_blank">
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card">
              <div className="card__header">
                <h3>🖥️ JT-Trader</h3>
              </div>
              <div className="card__body">
                <p>Торговая платформа и интерфейс</p>
                <div className="button-group">
                  <Link className="button button--secondary" to="/docs/jt-trader/010-getting-started">
                    Документация
                  </Link>
                  <Link className="button button--outline button--secondary" href="https://github.com/jt-lab-com/jt-trader" target="_blank">
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card">
              <div className="card__header">
                <h3>🌐 JT-Lab</h3>
              </div>
              <div className="card__body">
                <p>Официальный сайт и ресурсы</p>
                <div className="button-group">
                  <Link className="button button--primary" href="https://jt-lab.com" target="_blank">
                    Официальный сайт
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Полная документация по JT-Lib и JT-Trader - библиотекам для создания торговых стратегий и алгоритмической торговли на JavaScript">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickLinks />
      </main>
    </Layout>
  );
}
