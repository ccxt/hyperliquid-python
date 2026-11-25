import os
import sys
import asyncio

# if CCXT is included locally
# sys.path.append(os.path.dirname(os.path.dirname((os.path.abspath(__file__)))) + '/')

from __exchangeName__ import __ExchangeName__Ws

if sys.platform == 'win32':
	asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def my_watch_ticker(exchange, symbol):
    while (True):
        result = await exchange.watch_ticker(symbol)
        print(result)


async def my_watch_orderbook(exchange, symbol):
    while (True):
        result = await exchange.watch_order_book(symbol)
        print(result)




async def main():
    instance = __ExchangeName__Ws({})
    await instance.load_markets()
    symbol = "__EXAMPLE_SYMBOL__"

    # fetch ticker
    ticker = my_watch_ticker(instance, symbol)

    # fetch orderbook
    ob = my_watch_orderbook(instance, symbol)
   
    await asyncio.gather(ticker, ob)

    # close after you finish
    await instance.close()




asyncio.run(main())

