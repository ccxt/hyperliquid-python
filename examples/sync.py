import os
import sys

root = os.path.dirname(os.path.dirname((os.path.abspath(__file__))))
sys.path.append(root + '/')

from hyperliquid import HyperliquidSync


def main():
    instance = HyperliquidSync({})
    instance.load_markets()
    symbol = "BTC/USDC:USDC"

    # fetch ticker
    ticker = instance.fetch_ticker(symbol)
    print(ticker)

    # create order
    order = instance.create_order("BTC/USDC:USDC", "limit", "buy", 1, 123456.789)
    print(order)

main()

