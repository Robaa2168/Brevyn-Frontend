import React, { useState } from 'react';
import Currencies from './Currencies';
import CurrencyDetail from './CurrencyDetail';

const CurrenciesContainer = () => {
  const [activeComponent, setActiveComponent] = useState('currencies');
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);

  const handleViewDetails = (currencyId) => {
    setSelectedCurrencyId(currencyId);
    setActiveComponent('currencyDetail');
  };

  return (
    <div>
      {activeComponent === 'currencies' && (
        <Currencies onViewDetails={handleViewDetails} />
      )}
      {activeComponent === 'currencyDetail' && selectedCurrencyId && (
        <CurrencyDetail currencyId={selectedCurrencyId} onBack={() => setActiveComponent('currencies')} />
      )}
    </div>
  );
};

export default CurrenciesContainer;
