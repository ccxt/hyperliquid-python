import sys
import hyperliquid.ccxt as ccxt_module
sys.modules['ccxt'] = ccxt_module

from hyperliquid.ccxt import hyperliquid as HyperliquidSync
from hyperliquid.ccxt.async_support.hyperliquid import hyperliquid as HyperliquidAsync
from hyperliquid.ccxt.pro.hyperliquid import hyperliquid as HyperliquidWs
