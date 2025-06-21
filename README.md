# Alpha Strategy: Trend Detection and Trade Strategy Builder

## Overview
This repository contains our project for the Hackathon Techfest Hackathon, sponsored by Dhan App, where we secured **3rd Runner-up** position.

Our problem statement, **Alpha Strategy: Trend Detection and Trade Strategy Builder**, aimed to develop a robust trading strategy using historical price data to maximize alpha while maintaining an optimal balance between risk and reward.

---

## Objective
The objective was to:
- Build a trading strategy using **historical price data (OHLCV)**.
- Optimize for key performance metrics like **Sharpe Ratio** and **Total Return**.
- Enable the algorithm to calculate precise **entry/exit points** for selected instruments.

---

## Input
1. **Historical Price Data**:
   - OHLCV data from **2019 to 2022** for **30 instruments**.
2. **Task**:
   - Develop a strategy that maximizes alpha.
   - Strategy approaches could include:
     - **Technical Analysis**: Indicators like Moving Averages, RSI, MACD, or custom indicators.
     - **Statistical Models**: Mean reversion, momentum strategies, or pairs trading.
     - **Machine Learning**: Predictive models for price movements or clustering for regime detection.

---

## Methodology
### Data Preparation:
- Processed OHLCV data for all instruments.
- Split data for **training (2019-2021)** and **testing (2022)**.

### Strategy Development:
- Developed a custom strategy using:
  - **Bollinger Bands (BB)** for breakout signals.
  - **Relative Strength Index (RSI)** for confirmation of entry/exit points.
- Ensured strategy adaptability to other instruments in the same format.

### Performance Metrics:
- **Sharpe Ratio**: 7.21  
- **Total Return**: 90.63%  
- **Win Rate**: 62.50%  
- **Max Drawdown**: 11.53%  

---

## Output
Below is an example output of the strategy for **Adani Ports & SEZ**:

![image](https://github.com/user-attachments/assets/96d785ef-070c-4828-a24f-4c86e49c5910)


### Key Signals
- **Green Dots**: Entry points (Long entry with BB breakout and RSI confirmation).  
- **Red Dots**: Exit points (Price closed below upper Bollinger Band).  

---

## Key Features
1. Generates **entry/exit signals** for trading.
2. Optimizes **Sharpe Ratio** and other performance metrics.
3. Supports any instrument provided in OHLCV format.

---

## Tools Used
- **Python**  
- **Libraries**: Pandas, NumPy, Matplotlib, TA-Lib  
- **Platform**: Dhan App Integration  

---

## How to Use
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/alpha-strategy-trend-builder.git

---
## Acknowledgments
- Hackathon: Hackathon Techfest
- Sponsors: Dhan App
- Team Achievement: Secured 3rd Runner-Up in the competition.
