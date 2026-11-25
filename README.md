# hyperliquid-python
Python SDK (sync and async) for Hyperliquid cryptocurrency exchange with Rest and WS capabilities.

- You can check the SDK docs here: [SDK](https://docs.ccxt.com/#/exchanges/hyperliquid)
- You can check Hyperliquid's docs here: [Docs](https://www.google.com/search?q=google+hyperliquid+cryptocurrency+exchange+api+docs)
- Github repo: https://github.com/ccxt/hyperliquid-python
- Pypi package: https://pypi.org/project/hyperliquid


## Installation

```
pip install hyperliquid
```

## Usage

### Sync

```Python
from hyperliquid import HyperliquidSync

def main():
    instance = HyperliquidSync({})
    ob =  instance.fetch_order_book("BTC/USDC:USDC")
    print(ob)
    #
    # balance = instance.fetch_balance()
    # order = instance.create_order("BTC/USDC:USDC", "limit", "buy", 1, 100000)

main()
```

### Async

```Python
import sys
import asyncio
from hyperliquid import HyperliquidAsync

### on Windows, uncomment below:
# if sys.platform == 'win32':
# 	asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    instance = HyperliquidAsync({})
    ob =  await instance.fetch_order_book("BTC/USDC:USDC")
    print(ob)
    #
    # balance = await instance.fetch_balance()
    # order = await instance.create_order("BTC/USDC:USDC", "limit", "buy", 1, 100000)

    # once you are done with the exchange
    await instance.close()

asyncio.run(main())
```



### Websockets

```Python
import sys
from hyperliquid import HyperliquidWs

### on Windows, uncomment below:
# if sys.platform == 'win32':
# 	asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    instance = HyperliquidWs({})
    while True:
        ob = await instance.watch_order_book("BTC/USDC:USDC")
        print(ob)
        # orders = await instance.watch_orders("BTC/USDC:USDC")

    # once you are done with the exchange
    await instance.close()

asyncio.run(main())
```





#### Raw call

You can also construct custom requests to available "implicit" endpoints

```Python
        request = {
            'type': 'candleSnapshot',
            'req': {
                'coin': coin,
                'interval': tf,
                'startTime': since,
                'endTime': until,
            },
        }
        response = await instance.public_post_info(request)
```


## Available methods

### REST Unified

- `create_order_request(self, symbol: Str, type: Str, side: Str, amount: str, price: Str = None, params: dict = {})`
- `create_order(self, symbol: str, type: OrderType, side: OrderSide, amount: float, price: Num = None, params: dict = {})`
- `create_orders_request(self, orders: list, params: dict = {})`
- `create_orders(self, orders: list[OrderRequest], params: dict = {})`
- `create_sub_account(self, name: str, params: dict = {})`
- `create_twap_order(self, symbol: str, side: OrderSide, amount: float, duration: float, params: dict = {})`
- `create_vault(self, name: str, description: str, initialUsd: int, params: dict = {})`
- `fetch_balance(self, params: dict = {})`
- `fetch_canceled_and_closed_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_canceled_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_closed_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_currencies(self, params: dict = {})`
- `fetch_deposits(self, code: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_funding_history(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_funding_rate_history(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_funding_rate(self, symbol: str, params: dict = {})`
- `fetch_funding_rates(self, symbols: Strings = None, params: dict = {})`
- `fetch_hip3_markets(self, params: dict = {})`
- `fetch_ledger(self, code: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_markets(self, params: dict = {})`
- `fetch_my_liquidations(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_my_trades(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_ohlcv(self, symbol: str, timeframe: str = '1m', since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_open_interest(self, symbol: str, params: dict = {})`
- `fetch_open_interests(self, symbols: Strings = None, params: dict = {})`
- `fetch_open_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_order_book(self, symbol: str, limit: Int = None, params: dict = {})`
- `fetch_order(self, id: str, symbol: Str = None, params: dict = {})`
- `fetch_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_position(self, symbol: str, params: dict = {})`
- `fetch_positions(self, symbols: Strings = None, params: dict = {})`
- `fetch_spot_markets(self, params: dict = {})`
- `fetch_status(self, params: dict = {})`
- `fetch_swap_markets(self, params: dict = {})`
- `fetch_tickers(self, symbols: Strings = None, params: dict = {})`
- `fetch_time(self, params: dict = {})`
- `fetch_trades(self, symbol: str, since: Int = None, limit: Int = None, params: dict = {})`
- `fetch_trading_fee(self, symbol: str, params: dict = {})`
- `fetch_withdrawals(self, code: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `action_hash(self, action: object, vaultAddress: Str, nonce: object, expiresAfter: Int = None)`
- `add_margin(self, symbol: str, amount: float, params: dict = {})`
- `amount_to_precision(self, symbol: Str, amount: object)`
- `approve_builder_fee(self, builder: str, maxFeeRate: str)`
- `build_approve_builder_fee_sig(self, message: dict)`
- `build_send_asset_sig(self, message: dict)`
- `build_usd_class_send_sig(self, message: dict)`
- `build_usd_send_sig(self, message: dict)`
- `build_user_abstraction_sig(self, message: dict)`
- `build_user_dex_abstraction_sig(self, message: dict)`
- `build_withdraw_sig(self, message: dict)`
- `calculate_price_precision(self, price: float, amountPrecision: int, maxDecimals: int)`
- `calculate_rate_limiter_cost(self, api: list[str], method: str, path: str, params: object, config: dict = {})`
- `cancel_all_orders_after(self, timeout: Int, params: dict = {})`
- `cancel_order(self, id: str, symbol: Str = None, params: dict = {})`
- `cancel_orders_for_symbols(self, orders: list[CancellationRequest], params: dict = {})`
- `cancel_orders_request(self, ids: list[str], symbol: Str = None, params: dict = {})`
- `cancel_orders(self, ids: list[str], symbol: Str = None, params: dict = {})`
- `cancel_twap_order(self, id: str, symbol: Str = None, params: dict = {})`
- `coin_to_market_id(self, coin: Str)`
- `construct_phantom_agent(self, hash: object, isTestnet: bool = True)`
- `describe(self)`
- `edit_order(self, id: str, symbol: str, type: OrderType, side: OrderSide, amount: Num = None, price: Num = None, params: dict = {})`
- `edit_orders_request(self, orders: list, params: dict = {})`
- `edit_orders(self, orders: list[OrderRequest], params: dict = {})`
- `enable_user_dex_abstraction(self, enabled: bool, params: dict = {})`
- `extract_type_from_delta(self, data: list[dict] = [])`
- `format_vault_address(self, address: Str = None)`
- `get_dex_from_hip3_symbol(self, market: Market)`
- `get_dex_from_symbols(self, methodName: str, symbols: Strings = None)`
- `hash_message(self, message: object)`
- `initialize_client(self)`
- `is_unified_enabled(self, method: str, address: Str = None, shouldRefresh: bool = False, params: dict = {})`
- `market(self, symbol: Str)`
- `modify_margin_helper(self, symbol: str, amount: Num, type: str, params: dict = {})`
- `nonce(self)`
- `price_to_precision(self, symbol: Str, price: object)`
- `reduce_margin(self, symbol: str, amount: float, params: dict = {})`
- `reserve_request_weight(self, weight: Num, params: dict = {})`
- `set_agent_abstraction(self, abstraction: str, params: dict = {})`
- `set_leverage(self, leverage: int, symbol: Str = None, params: dict = {})`
- `set_margin_mode(self, marginMode: str, symbol: Str = None, params: dict = {})`
- `set_ref(self)`
- `set_sandbox_mode(self, enabled: bool)`
- `set_user_abstraction(self, abstraction: str, params: dict = {})`
- `transfer(self, code: str, amount: float, fromAccount: str, toAccount: str, params: dict = {})`
- `update_spot_currency_code(self, code: Str)`
- `withdraw(self, code: str, amount: float, address: str, params: dict = {})`

### REST Raw

- `public_post_info(request)`
- `private_post_exchange(request)`

### WS Unified

- `describe(self)`
- `create_orders_ws(self, orders: list[OrderRequest], params: dict = {})`
- `create_order_ws(self, symbol: str, type: OrderType, side: OrderSide, amount: float, price: Num = None, params: dict = {})`
- `edit_order_ws(self, id: str, symbol: str, type: str, side: str, amount: Num = None, price: Num = None, params: dict = {})`
- `cancel_orders_ws(self, ids: list[str], symbol: Str = None, params: dict = {})`
- `cancel_order_ws(self, id: str, symbol: Str = None, params: dict = {})`
- `watch_order_book(self, symbol: str, limit: Int = None, params: dict = {})`
- `un_watch_order_book(self, symbol: str, params: dict = {})`
- `watch_ticker(self, symbol: str, params: dict = {})`
- `un_watch_ticker(self, symbol: str, params: dict = {})`
- `watch_tickers(self, symbols: Strings = None, params: dict = {})`
- `un_watch_tickers(self, symbols: Strings = None, params: dict = {})`
- `watch_my_trades(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `watch_my_liquidations(self, symbol: str, since: Int = None, limit: Int = None, params: dict = {})`
- `watch_my_liquidations_for_symbols(self, symbols: list[str], since: Int = None, limit: Int = None, params: dict = {})`
- `un_watch_my_trades(self, symbol: Str = None, params: dict = {})`
- `watch_trades(self, symbol: str, since: Int = None, limit: Int = None, params: dict = {})`
- `un_watch_trades(self, symbol: str, params: dict = {})`
- `watch_ohlcv(self, symbol: str, timeframe: str = '1m', since: Int = None, limit: Int = None, params: dict = {})`
- `un_watch_ohlcv(self, symbol: str, timeframe: str = '1m', params: dict = {})`
- `watch_balance(self, params: dict = {})`
- `un_watch_balance(self, params: dict = {})`
- `watch_positions(self, symbols: Strings = None, since: Int = None, limit: Int = None, params: dict = {})`
- `set_positions_cache(self, client: Client, symbols: Strings = None)`
- `un_watch_positions(self, symbols: Strings = None, params: dict = {})`
- `watch_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params: dict = {})`
- `un_watch_orders(self, symbol: Str = None, params: dict = {})`
- `wait_for_pending_unsubscribe(self, url: str, subHash: str)`
- `expire_pending_unsubscribe(self, client: Client, subHash: str, unsubHash: str)`
- `wrap_as_post_action(self, request: dict)`

## Contribution
- Give us a star :star:
- Fork and Clone! Awesome
- Select existing issues or create a new issue.