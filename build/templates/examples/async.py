import os
import sys
import asyncio

# if CCXT is included locally
# sys.path.append(os.path.dirname(os.path.dirname((os.path.abspath(__file__)))) + '/')

from __exchangeName__ import __ExchangeName__Async

if sys.platform == 'win32':
	asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    instance = __ExchangeName__Async({})
    await instance.load_markets()
    symbol = "__EXAMPLE_SYMBOL__"

    # fetch ticker
    ticker = await instance.fetch_ticker(symbol)
    print(ticker)

    # create order
    order = await instance.create_order("__EXAMPLE_SYMBOL__", "limit", "buy", 1, 123456.789)
    print(order)

    # close after you finish
    await instance.close()

asyncio.run(main())

