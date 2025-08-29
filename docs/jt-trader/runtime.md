---
id: runtime
title: Runtime
sidebar_label: Runtime
---

# Runtime

Runtime allows you to run and manage trading bots (scripts) in JT-Trader.

## Running The Bot (Script)

To run bot click **Create Runtime**.

## Required Parameters

* **Name**: Name of the test scenario.
* **Prefix**: The prefix is used to generate the clientOrderId. Scripts with the market launch type will only receive orders created with this prefix.
* **Strategy**: Trading script file. The Strategy class is described inside the file.
* **Exchange**: The exchange on which the strategy will be launched.
* **Type**: Market or system.
  * If the launch type is market, then the script will be launched for only one symbol.
  * If system, then the script will have no trading functions, but will be able to receive notifications about all orders onOrderChange.

![Runtime Screenshot](/images/image_runtime2.avif)

## Parameters

These are additional parameters passed to the script, defined by the script developers. If you have purchased a script from the store, refer to your robot's description for details.

Most commonly, one of the required parameters is "symbols" or "coins," which is a list of the trading pairs that the robot will operate on.

## Scripts List

* **ID**: Unique identifier of the script.
* **Prefix**: Runtime prefix.
* **Name**: Name of runtime config.
* **Script**: Script file name.
* **Script Type**: Type of script.
  * **Local**: Script compiled on the server from source code.
  * **Remote (bundle)**: Script from DB. See Developer -> [Bundles](../../jt-lab-dashboard/developer-zone#bundles).
  * **Remote (app)**: Script purchased from the store. See User -> [Bots](../../jt-lab-dashboard/user-zone#bots).
* **Exchange**: The exchange where the script is running.
* **Updated**: Date of the last script update.
* **Status**: Current status of the script.
  * **Running**: Script is active.
  * **Stopped**: Script is not running.

### Control Buttons

* **Start/Stop**: Start or stop the script.
* **Report**: Generate a report on the script's operation.
* **Logs**: View operation logs.
* **Edit**: Modify runtime settings.
* **Copy**: Copy the script.
* **Delete**: Delete the script.

![Runtime Screenshot](/images/image_runtime1.avif)

:::info Logs
Logs are divided into two parts: the main logs are displayed in the log window on the Runtime tab. More detailed logs can be viewed in the Logs table in the report.
:::

## Next Steps

- **[Getting Started](/docs/jt-trader/jt-trader-getting-started)** - Learn the basics of using JT-Trader
- **[Configuration](/docs/jt-trader/configuration)** - Configure your trading environment
- **[Usage](/docs/jt-trader/usage)** - Advanced usage patterns and best practices

