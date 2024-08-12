import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import color from "../../data/color.json";

const PieChart = ({subscriptionData}) => {
  const [shuffledColors, setShuffledColors] = useState([]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    setShuffledColors(shuffleArray(color.map(item => item.code)));
  }, []);

  const getChartOptions = (data) => {
    const seriesData = data.map(item => item.count);
    const labels = data.map(item => item.plan?.title || item.title);
    return {
      series: seriesData,
      colors: shuffledColors,
      chart: {
        height: 420,
        type: "pie",
      },
      stroke: {
        colors: ["white"],
      },
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -25,
            formatter: function (val, opts) {
              const total = opts.series.reduce((acc, value) => acc + value, 0);
              const percent = (val / total) * 100;
              return `${percent.toFixed(1)}%`;
            },
          },
        },
      },
      labels: labels,
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        fontSize: '16px'
      },
    };
  };

  return (
    <div className='lg:flex lg:gap-[30px]'>
      {/* {planDistribution && planDistribution.length > 0 &&
        <div className="lg:w-1/2 cursor-pointer max-lg:mb-[20px]">
          <div className='relative bg-[#fff] rounded-[10px] px-[20px] py-[30px] drop-shadow'>
            <h3 className='text-[#000] text-[20px] font-semibold mb-[10px]'>Plan Distribution</h3>
            <Chart
              options={getChartOptions(planDistribution)}
              series={planDistribution.map(item => item.count)}
              type="pie"
              height={380}
            />
          </div>
        </div>
      } */}
      {subscriptionData && subscriptionData.length > 0 &&
        <div className="lg:w-1/2 cursor-pointer">
          <div className='relative bg-[#fff] rounded-[10px] px-[20px] py-[30px] drop-shadow'>
            <h3 className='text-[#000] text-[20px] font-semibold mb-[10px]'>Subscription Levels</h3>
            <Chart
              options={getChartOptions(subscriptionData)}
              series={subscriptionData.map(item => item.count)}
              type="pie"
              height={380}
            />
          </div>
        </div>
      }
    </div>
  );
};

export default PieChart;