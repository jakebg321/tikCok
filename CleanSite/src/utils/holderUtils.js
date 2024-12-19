export const processHolderData = (holders, maxBubbles = 40) => {
    if (!holders || !holders.length) return [];
    
    const validHolders = holders.filter(holder => 
        holder && 
        holder.address && 
        holder.balance && 
        holder.percentage &&
        typeof holder.address === 'string' &&
        !isNaN(parseFloat(holder.balance)) &&
        !isNaN(parseFloat(holder.percentage))
    );

    if (validHolders.length === 0) return [];
    
    const sortedHolders = [...validHolders].sort((a, b) => 
        parseFloat(b.percentage) - parseFloat(a.percentage)
    );
    
    const maxBalance = Math.max(...sortedHolders.map(h => parseFloat(h.balance)));
    
    return sortedHolders.slice(0, maxBubbles).map(holder => {
        const balance = parseFloat(holder.balance) || 0;
        const percentage = parseFloat(holder.percentage) || 0;
        
        return {
            address: holder.address,
            balance: balance,
            percentage: percentage,
            shortAddress: holder.address ? 
                `${holder.address.slice(0, 6)}...${holder.address.slice(-4)}` : 
                'Unknown',
            normalizedBalance: maxBalance ? balance / maxBalance : 0
        };
    });
};

export const calculateBubbleLayout = (processedHolders, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
  
    return processedHolders.map((holder, index) => {
        const theta = index * (Math.PI * 0.5);
        const spiralRadius = maxRadius * Math.log(1 + index) / Math.log(processedHolders.length);
        
        const jitterX = (Math.random() - 0.5) * 20;
        const jitterY = (Math.random() - 0.5) * 20;
        
        const x = centerX + (Math.cos(theta) * spiralRadius) + jitterX;
        const y = centerY + (Math.sin(theta) * spiralRadius) + jitterY;
        
        const radius = Math.max(15, Math.min(50, holder.percentage * 1.5));
        
        return {
            ...holder,
            x,
            y,
            radius,
            animationDelay: index * 0.05
        };
    });
};

export const calculateHolderStats = (holders) => {
    if (!holders || !holders.length) {
        return {
            totalHolders: 0,
            totalSupply: 0,
            averageHolding: 0,
            medianPercentage: 0,
            concentrationIndex: 0
        };
    }

    const totalHolders = holders.length;
    const totalSupply = holders.reduce((sum, h) => sum + parseFloat(h.balance), 0);
    const averageHolding = totalSupply / totalHolders;
    
    const sortedPercentages = [...holders]
        .map(h => parseFloat(h.percentage))
        .sort((a, b) => a - b);
    const midPoint = Math.floor(sortedPercentages.length / 2);
    const medianPercentage = sortedPercentages.length % 2 === 0
        ? (sortedPercentages[midPoint - 1] + sortedPercentages[midPoint]) / 2
        : sortedPercentages[midPoint];
    
    const concentrationIndex = holders.reduce((sum, holder) => {
        const percentage = parseFloat(holder.percentage);
        return sum + (percentage * percentage);
    }, 0) / 10000;
    
    return {
        totalHolders,
        totalSupply,
        averageHolding,
        medianPercentage,
        concentrationIndex
    };
};

export const groupHoldersByPercentage = (holders) => {
    const groups = {
        major: [],
        significant: [],
        medium: [],
        small: []
    };
    
    holders.forEach(holder => {
        const percentage = parseFloat(holder.percentage);
        if (percentage > 5) groups.major.push(holder);
        else if (percentage > 1) groups.significant.push(holder);
        else if (percentage > 0.1) groups.medium.push(holder);
        else groups.small.push(holder);
    });
    
    return groups;
};