export const selectRandomCoin = (coinsData, displayedCoins = []) => {
    console.log('Selecting random coin from', coinsData?.length, 'coins');
    console.log('Previously displayed coins:', displayedCoins);
    
    if (!coinsData || coinsData.length === 0) {
        console.log('No coin data available');
        return null;
    }
    
    // First filter by market cap and previously displayed coins
    let availableCoins = coinsData.filter(coin => 
        coin.coin_info.market_cap >= 300000 && // Market cap filter
        !displayedCoins.includes(coin.coin_info.contract_address)
    );
    console.log('Available coins after market cap and display filtering:', availableCoins.length);
    
    // If we've shown all valid coins, reset but keep market cap filter
    if (availableCoins.length === 0) {
        console.log('All coins shown, resetting selection pool with market cap filter');
        availableCoins = coinsData.filter(coin => 
            coin.coin_info.market_cap >= 300000
        );
    }

    const randomIndex = Math.floor(Math.random() * availableCoins.length);
    const selectedCoin = availableCoins[randomIndex];
    
    console.log('Selected coin:', selectedCoin?.coin_info?.name, 
                'Market Cap:', selectedCoin?.coin_info?.market_cap);
    return selectedCoin;
};

export const processHolderData = (holders, maxBubbles = 40) => {
    console.log('Processing holders:', holders?.length);
    
    if (!holders || !holders.length) {
        console.warn('No holders to process');
        return [];
    }

    console.log('Sample holder data:', holders[0]);

    const sortedHolders = [...holders]
        .map(holder => ({
            ...holder,
            balance: parseFloat(holder.balance) || 0,
            percentage: parseFloat(holder.percentage) || 0
        }))
        .sort((a, b) => b.percentage - a.percentage);

    console.log('First holder after sorting:', sortedHolders[0]);
    console.log('Last holder after sorting:', sortedHolders[sortedHolders.length - 1]);

    const processedHolders = sortedHolders.slice(0, maxBubbles).map(holder => ({
        address: holder.address,
        balance: holder.balance,
        percentage: holder.percentage,
        shortAddress: `${holder.address.slice(0, 6)}...${holder.address.slice(-4)}`,
        _debug: {
            originalBalance: holder.balance,
            originalPercentage: holder.percentage
        }
    }));

    console.log('Processed holders sample:', processedHolders[0]);
    console.log('Percentage range:', {
        max: Math.max(...processedHolders.map(h => h.percentage)),
        min: Math.min(...processedHolders.map(h => h.percentage))
    });

    return processedHolders;
};

export const calculateBubbleLayout = (processedHolders, width, height) => {
    console.log('Calculating bubble layout for', processedHolders.length, 'holders');
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    const HUB_RADIUS = 60;

    console.log('Layout parameters:', { centerX, centerY, maxRadius, HUB_RADIUS });

    const calculatedPositions = processedHolders.map((holder, index) => {
        const angle = (index / processedHolders.length) * Math.PI * 2;
        const radiusFactor = 0.3 + (0.7 * (1 - (holder.percentage / 100)));
        const distance = HUB_RADIUS + (maxRadius - HUB_RADIUS) * radiusFactor;
        
        const jitter = 20;
        const x = centerX + (Math.cos(angle) * distance) + (Math.random() - 0.5) * jitter;
        const y = centerY + (Math.sin(angle) * distance) + (Math.random() - 0.5) * jitter;
        
        const minRadius = 20;
        const maxBubbleRadius = 60;
        const radius = minRadius + (maxBubbleRadius - minRadius) * (holder.percentage / 100);

        const position = {
            ...holder,
            x,
            y,
            radius: Math.max(minRadius, Math.min(maxBubbleRadius, radius)),
            _debug: {
                angle,
                distance,
                radiusFactor,
                originalPercentage: holder.percentage
            }
        };

        console.log(`Holder ${index + 1}/${processedHolders.length}:`, {
            percentage: holder.percentage.toFixed(2),
            radius: position.radius.toFixed(2),
            x: position.x.toFixed(2),
            y: position.y.toFixed(2)
        });

        return position;
    });

    return calculatedPositions;
};

export const validateHolderData = (holders) => {
    if (!holders || !Array.isArray(holders)) {
        console.error('Invalid holders data structure:', holders);
        return false;
    }

    const sampleHolder = holders[0];
    console.log('Validating holder data structure:', sampleHolder);

    const requiredFields = ['address', 'balance', 'percentage'];
    const missingFields = requiredFields.filter(field => !sampleHolder?.hasOwnProperty(field));
    
    if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        return false;
    }

    return true;
};

const isPositionValid = (x, y, radius, existingPositions) => {
    const HUB_RADIUS = 60;
    
    // Check distance from center
    const distanceFromCenter = Math.sqrt(Math.pow(x - 400, 2) + Math.pow(y - 300, 2));
    if (distanceFromCenter < HUB_RADIUS + radius) {
        return false;
    }
    
    // Check overlap with existing bubbles
    for (const pos of existingPositions) {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        if (distance < (radius + pos.radius)) {
            return false;
        }
    }
    
    return true;
};

export const formatNumberWithSuffix = (number) => {
    console.log('Formatting number:', number);
    if (!number || isNaN(number)) {
        console.log('Invalid number provided');
        return '0';
    }

    try {
        if (number >= 1e9) {
            return `${(number / 1e9).toFixed(2)}B`;
        } else if (number >= 1e6) {
            return `${(number / 1e6).toFixed(2)}M`;
        } else if (number >= 1e3) {
            return `${(number / 1e3).toFixed(2)}K`;
        }
        return number.toFixed(2);
    } catch (error) {
        console.error('Error formatting number:', error);
        return '0';
    }
};