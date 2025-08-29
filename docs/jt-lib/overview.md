---
id: overview
title: Overview
sidebar_label: Overview
---

# Overview

JT-Lib is a library designed for writing trading robots for JT-Trader. It provides a simplified interface for interacting with exchanges and implementing trading strategies.

:::info GitHub Repository
This manual provides general information about JT-Lib and creating trading bots. For detailed instructions and source codes, please visit our [GitHub](https://github.com/xsystems8/jt-lib)
:::

## OrdersBasket

The functionality for managing exchange orders and positions is implemented in OrdersBasket. It includes a filtering system where each class instance handles its own orders. It also incorporates logic for working with stop-loss and take-profit orders since exchanges do not automatically remove paired SL/TP orders. This necessitates manual monitoring. Additionally, the implementation of server-side trigger orders is possible.

## Triggers

The trigger system is designed to activate based on specific conditions such as time, price, or the arrival of new orders.

## Events

An event system is implemented to handle occurrences like the receipt of a new order, a new candle, or a new transaction. This is particularly useful for implementing strategies based on multiple pairs or event-driven strategies.

## Storage

A data storage system is implemented that allows robots to save necessary data in memory and utilize it upon reboot. The class is designed so that objects can restore their last state.

## Report

A reporting system is implemented to create real-time reports that can be displayed in a web interface. Reports can include various widgets such as cards, tables, charts, etc. This is very useful for debugging strategies and analyzing their performance, as well as for reporting on the operation of an already functioning bot.

## Indicators

An indicators and candle buffers system is implemented. Indicators can be created and used in strategies across different periods.

For more detailed descriptions of methods and interfaces, please refer to the documentation on GitHub.

## Next Steps

- **[Getting Started](/docs/jt-lib/getting-started)** - Learn the basics of using JT-Lib
- **[Interfaces](/docs/jt-lib/interfaces)** - Detailed API documentation
- **[API Specification](/docs/jt-lib/api-specification)** - Complete API reference
