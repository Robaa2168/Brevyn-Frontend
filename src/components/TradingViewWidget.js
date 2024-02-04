import React, { useEffect, useRef } from 'react';

const ForexStrip = () => {
  const widgetRef = useRef(null); // Use useRef to reference the widget container

  useEffect(() => {
    // Ensure the widget container is empty before inserting the script
    if (widgetRef.current) {
      widgetRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    // The script's content needs to be JSON, defining the widget's configuration
    script.innerHTML = JSON.stringify({
      "symbols": [
        {"proName": "FOREXCOM:SPXUSD", "title": "S&P 500"},
        {"proName": "FOREXCOM:NSXUSD", "title": "US 100"},
        {"proName": "FX_IDC:EURUSD", "title": "EUR to USD"},
        {"description": "GBP to USD", "proName": "FX:GBPUSD"},
        {"description": "USD to CAD", "proName": "FX:USDCAD"},
        {"description": "AUD to USD", "proName": "FX:AUDUSD"},
        {"description": "EUR to GBP", "proName": "FX:EURGBP"}
      ],
      "showSymbolLogo": true,
      "isTransparent": true,
      "displayMode": "adaptive",
      "colorTheme": "light",
      "locale": "en"
    });

    // Append the script to the div we've ref'ed
    widgetRef.current.appendChild(script);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="tradingview-widget-container" ref={widgetRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default React.memo(ForexStrip);
