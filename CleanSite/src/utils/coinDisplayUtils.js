export const selectRandomCoin = (coinsData, displayedCoins = []) => {
    
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

const isPositionValid = (x, y, radius, existingPositions, centerX, centerY) => {
    const SAFETY_MARGIN = 1.12; // 20% extra space between bubbles
    const CENTER_SAFETY_MARGIN = 1.13; // 30% extra space around center
    const HUB_RADIUS = 40;
    
    // Check distance from center with safety margin
    const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    if (distanceFromCenter < (HUB_RADIUS + radius) * CENTER_SAFETY_MARGIN) {
        return false;
    }
    
    // Check overlap with existing bubbles including safety margin
    for (const pos of existingPositions) {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        const minDistance = (radius + pos.radius) * SAFETY_MARGIN;
        if (distance < minDistance) {
            return false;
        }
    }
    
    return true;
};

export const calculateBubbleLayout = (holders, width, height) => {
    const CENTER_X = width / 2;
    const CENTER_Y = height / 2;
    const SAFE_RADIUS = 100; // Minimum distance from center

    return holders.map(holder => {
        let angle, radius, x, y;
        let isTooClose = true;
        let attempts = 0;

        // Keep trying until we find a position outside the safe area
        while (isTooClose && attempts < 10) {
            angle = Math.random() * 2 * Math.PI;
            radius = SAFE_RADIUS + Math.random() * 200; // Start from safe radius
            x = CENTER_X + radius * Math.cos(angle);
            y = CENTER_Y + radius * Math.sin(angle);

            // Check if the bubble (including its radius) would intersect with safe area
            const bubbleRadius = Math.max(30, Math.min(80, holder.percentage * 3));
            const distanceFromCenter = Math.sqrt(
                Math.pow(x - CENTER_X, 2) + Math.pow(y - CENTER_Y, 2)
            );
            
            isTooClose = distanceFromCenter - bubbleRadius < SAFE_RADIUS;
            attempts++;
        }

        return {
            ...holder,
            x: x,
            y: y
        };
    });
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