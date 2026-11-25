# __exchangeName__-python
Python SDK (sync and async) for __ExchangeName__ cryptocurrency exchange with Rest and WS capabilities.

- You can check the SDK docs here: [SDK](https://docs.ccxt.com/#/exchanges/__exchangeName__)
- You can check __ExchangeName__'s docs here: [Docs](__LINK_TO_OFFICIAL_EXCHANGE_DOCS__)
- Github repo: https://github.com/ccxt/__exchangeName__-python
- Pypi package: https://pypi.org/project/__PYTHON_PACKAGE_NAME__


## Installation

```
pip install __PYTHON_PACKAGE_NAME__
```

## Usage

### Sync

```Python
from __exchangeName__ import __ExchangeName__Sync

def main():
    instance = __ExchangeName__Sync({})
    ob =  instance.fetch_order_book("__EXAMPLE_SYMBOL__")
    print(ob)
    #
    # balance = instance.fetch_balance()
    # order = instance.create_order("__EXAMPLE_SYMBOL__", "limit", "buy", 1, 100000)

main()
```

### Async

```Python
import sys
import asyncio
from __exchangeName__ import __ExchangeName__Async

### on Windows, uncomment below:
# if sys.platform == 'win32':
# 	asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    instance = __ExchangeName__Async({})
    ob =  await instance.fetch_order_book("__EXAMPLE_SYMBOL__")
    print(ob)
    #
    # balance = await instance.fetch_balance()
    # order = await instance.create_order("__EXAMPLE_SYMBOL__", "limit", "buy", 1, 100000)

    # once you are done with the exchange
    await instance.close()

asyncio.run(main())
```



### Websockets

```Python
import sys
from __exchangeName__ import __ExchangeName__Ws

### on Windows, uncomment below:
# if sys.platform == 'win32':
# 	asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    instance = __ExchangeName__Ws({})
    while True:
        ob = await instance.watch_order_book("__EXAMPLE_SYMBOL__")
        print(ob)
        # orders = await instance.watch_orders("__EXAMPLE_SYMBOL__")

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

- `example(self, params={})`

### REST Raw

- `example(request)`

### WS Unified

- `example(self)`



## Contribution
- Give us a star :star:
- Fork and Clone! Awesome
- Select existing issues or create a new issue.