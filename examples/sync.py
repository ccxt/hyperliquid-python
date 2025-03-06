import os
import sys

root = os.path.dirname(os.path.dirname((os.path.abspath(__file__))))
sys.path.append(root + '/')

from hyperliquid.ccxt import hyperliquid


def main():
    instance = hyperliquid({})
    instance.load_markets()
    symbol = "BTC/USDC:USDC"

    # fetch ticker
    #
    ticker = instance.fetch_ticker(symbol)
    print(ticker)

    # fetch ohlcv
    #
    ohlcv = instance.fetch_ohlcv(symbol, "1m")
    print(ohlcv)


main()

