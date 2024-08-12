import React, { useEffect, useState } from 'react';
import { GetRequest } from '../../utils/request';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';

const SplineChart = () => {
    const { accountInfo } = useSelector((state) => state.account);
    const [subscriptionStats, setSubscriptionStats] = useState({
        Free: [],
        Premium: [],
    });
    
    const getSubscriptionStats = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accountInfo.token}`,
            },
        }
        GetRequest(`${process.env.REACT_APP_URL}/subscription/stats`, config).then((response) => {
            setSubscriptionStats(response.data);
        }).catch((error) => {
            console.log("Errors fetching data", error);
        });
    }
    useEffect(() => {
        if (accountInfo?.token) {
            getSubscriptionStats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountInfo]);

    const dates = Array.from(new Set(subscriptionStats.Free.concat(subscriptionStats.Premium).map(item => item.date)));
    const series = Object.keys(subscriptionStats).map(category => ({
        name: category,
        data: dates.map(date => {
            const found = subscriptionStats[category].find(item => item.date === date);
            return found ? found.count : 0;
        }),
    }));
    const options = {
        chart: {
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.3,
                opacityTo: 0.4,
            }
        },
        title: {
            text: '',
            align: 'left',
            style: {
                fontSize: '24px'
            }
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.4
            }
        },
        xaxis: {
            categories: dates,
            labels: {
                style: {
                    fontSize: '16px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '16px',
                }
            },
            tickAmount: 5
        },
        legend: {
            position: "bottom",
            fontFamily: "Inter, sans-serif",
            fontSize: '16px'
        },
    };
    return (
        <div className='relative bg-[#fff] rounded-[10px] px-[20px] py-[30px] drop-shadow'>
            <h3 className='text-[#000] text-[20px] font-semibold mb-[10px]'>Subscribers Statistics</h3>
            <Chart options={options} series={series} type='area' height={335} />
        </div>
    );
}

export default SplineChart;