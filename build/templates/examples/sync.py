import os
import sys

root = os.path.dirname(os.path.dirname((os.path.abspath(__file__))))
sys.path.append(root + '/')

from __exchangeName__ import __ExchangeName__Sync


def main():
    instance = __ExchangeName__Sync({})
    instance.load_markets()
    symbol = "__EXAMPLE_SYMBOL__"

    # fetch ticker
    ticker = instance.fetch_ticker(symbol)
    print(ticker)

    # create order
    order = instance.create_order("__EXAMPLE_SYMBOL__", "limit", "buy", 1, 123456.789)
    print(order)

main()

