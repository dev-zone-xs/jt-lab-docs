---
id: tester
title: Tester
sidebar_label: Tester
---

# Tester

The strategy tester is a comprehensive tool that allows developers to test algorithmic trading strategies using historical price data.

## How it works?

The strategy tester offers a unique opportunity to analyze the effectiveness of algorithms under various market conditions without the risk of real financial losses by simulating real-world trading environments.

However, it's important to note that the results obtained during testing do not guarantee similar success in live trading, as market conditions can vary significantly.

### Tester Parameters

* **Symbols**: List of trading pairs to be tested.
* **Spread**: Difference between buy and sell prices.
* **Start Date**: Start date of the testing.
* **End Date**: End date of the testing.
* **Maker Fee**: Commission for market orders.
* **Taker Fee**: Commission for limit orders.
* **Leverage**: Maximum leverage.
* **Balance**: Initial balance.
* **Exchange**: Selection of the exchange.

![Tester Screenshot](/images/image_tester1.avif)

## Parameters

Parameters passed to the script.

For example, a trading bot may accept the following parameters:

* **`sizeUsd` (100 USD)**: Trade size.
* **`tpPercent` (2%)**: Percentage to set Take-Profit.
* **`slPercent` (1%)**: Percentage to set Stop-Loss.

So, the robot will open trades for $100, set a Take-Profit at 2%, and a Stop-Loss at 1% from the opening price. If you change **`sizeUsd`** to 200 USD, the robot will open trades for $200.

## Strategy Optimization

Optimization is the process of tuning algorithm parameters to improve outcomes. This includes:

* Selecting parameters for optimization.
* Setting ranges for parameter values.
* Initiating the optimization process.
* Analyzing results to enhance the efficiency and profitability of trading.

## Multi-Currency Backtesting

Parameter **Symbols** can take a list of symbols, allowing for the simultaneous testing of multi-pair strategies. After the completion of testing across all pairs, the results for each will be compiled into a single comprehensive report. This enables the generation of a report for a multi-pair robot.

![Tester Screenshot](/images/image_tester2.avif)
![Tester Screenshot](/images/image_tester3.avif)

## Next Steps

- **[Getting Started](/docs/jt-trader/jt-trader-getting-started)** - Learn the basics of using JT-Trader
- **[Runtime](/docs/jt-trader/runtime)** - Running and managing trading bots
- **[Configuration](/docs/jt-trader/configuration)** - Configure your trading environment



