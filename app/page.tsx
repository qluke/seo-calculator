"use client";

import { useState } from "react";
import { Minus, Plus, BarChart4, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SeoCalculator() {
  // 核心数据模型
  const [monthlyIncome, setMonthlyIncome] = useState(1000);
  const [websiteCount, setWebsiteCount] = useState(1);
  const [keywordsPerSite, setKeywordsPerSite] = useState(1);
  const [rankPosition, setRankPosition] = useState(3);
  const [adRevenue, setAdRevenue] = useState(5);
  const [saasRevenue, setSaasRevenue] = useState(100);
  const [pvPerUv, setPvPerUv] = useState(2);
  const [keywordKD, setKeywordKD] = useState(30);

  // 常量
  const rankClickRates = {
    1: 39.8,
    2: 18.7,
    3: 10.2,
    4: 7.2,
    5: 5.1,
    6: 4.4,
    7: 3.0,
    8: 2.1,
    9: 1.9,
    10: 1.6,
  };

  const kdToReferringDomains = {
    0: 0,
    10: 10,
    20: 22,
    30: 36,
    40: 56,
    50: 84,
    60: 129,
    70: 202,
    80: 353,
    90: 756,
    100: 1200,
  };

  // 辅助函数
  const adjustValue = (setter, currentValue, amount, min, max) => {
    const newValue = Math.round((currentValue + amount) * 100) / 100;
    if (newValue >= min && newValue <= max) {
      setter(newValue);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getLinkCost = (linkOrder) => {
    if (linkOrder <= 10) {
      return 100;
    }

    if (linkOrder <= 50) {
      return 100 * (1 + (linkOrder - 10) * 0.01);
    }

    if (linkOrder <= 200) {
      return 100 * (1 + (50 - 10) * 0.01 + (linkOrder - 50) * 0.015);
    }

    return (
      100 *
      (1 + (50 - 10) * 0.01 + (200 - 50) * 0.015 + (linkOrder - 200) * 0.02)
    );
  };

  const getTotalLinkCost = (totalLinks) => {
    let totalCost = 0;
    for (let i = 1; i <= totalLinks; i++) {
      totalCost += getLinkCost(i);
    }
    return totalCost;
  };

  // 计算结果
  const calculateResults = () => {
    const clickRate = rankClickRates[rankPosition] / 100;
    const dailyIncome = monthlyIncome / 30;
    const yearlyIncome = monthlyIncome * 12;
    const adRevenuePerUv = (adRevenue / 1000) * pvPerUv;
    const saasRevenuePerUv = saasRevenue / 1000;
    const totalRevenuePerUv = adRevenuePerUv + saasRevenuePerUv;

    const totalDailyUv = dailyIncome / totalRevenuePerUv;
    const uvPerSite = totalDailyUv / websiteCount;
    const pvPerSite = uvPerSite * pvPerUv;
    const searchVolumePerKeyword = uvPerSite / keywordsPerSite / clickRate;

    const requiredDomains = kdToReferringDomains[keywordKD];
    const totalLinkCost = websiteCount * getTotalLinkCost(requiredDomains);

    const roi =
      totalLinkCost > 0 ? Number((yearlyIncome / totalLinkCost).toFixed(2)) : 0;

    const risks = {
      highSearchVolume: searchVolumePerKeyword > 10000,
      lowRoi: roi < 1,
      highCost: totalLinkCost > monthlyIncome * 6,
      inefficientKD: keywordKD >= 30 && searchVolumePerKeyword < 1000,
    };

    return {
      dailyIncome: dailyIncome.toFixed(2),
      revenuePerUv: totalRevenuePerUv.toFixed(4),
      adRevenuePerUv: adRevenuePerUv.toFixed(4),
      saasRevenuePerUv: saasRevenuePerUv.toFixed(4),
      totalDailyUv: Math.round(totalDailyUv),
      uvPerSite: Math.round(uvPerSite),
      pvPerSite: Math.round(pvPerSite),
      searchVolumePerKeyword: Math.round(searchVolumePerKeyword),
      requiredDomains,
      totalLinkCost: Math.round(totalLinkCost),
      yearlyIncome: Math.round(yearlyIncome),
      roi,
      risks,
    };
  };

  const results = calculateResults();

  // 输入控件组件
  const InputControl = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    info,
  }) => (
    <div className="mb-3">
      <Label className="text-sm font-medium mb-1.5 block">{label}</Label>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustValue(onChange, value, -step, min, max)}
          className="h-8 w-8 flex items-center justify-center"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const val = Number.parseFloat(e.target.value);
            if (!isNaN(val) && val >= min && val <= max) {
              onChange(val);
            }
          }}
          className="h-8 text-center"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustValue(onChange, value, step, min, max)}
          className="h-8 w-8 flex items-center justify-center"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      {info && <p className="text-xs text-muted-foreground mt-1">{info}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            SEO 收入目标计算器
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm">
            SEO
            收入目标计算器根据目标收入和参数分解目标，计算实现目标所需的条件，帮助您更好地评估
            SEO 投资和回报。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧输入区域 */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">目标收入与网站数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <InputControl
                    label="目标月收入 (美元)"
                    value={monthlyIncome}
                    onChange={setMonthlyIncome}
                    min={100}
                    max={100000}
                    step={100}
                  />
                  <InputControl
                    label="网站数量"
                    value={websiteCount}
                    onChange={setWebsiteCount}
                    min={1}
                    max={10}
                  />
                  <InputControl
                    label="每个网站的关键词数量"
                    value={keywordsPerSite}
                    onChange={setKeywordsPerSite}
                    min={1}
                    max={50}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">收入参数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <InputControl
                    label="目标排名位置"
                    value={rankPosition}
                    onChange={setRankPosition}
                    min={1}
                    max={10}
                    info={`当前点击率: ${rankClickRates[rankPosition]}%`}
                  />
                  <InputControl
                    label="每千次页面浏览的广告收入 (美元)"
                    value={adRevenue}
                    onChange={setAdRevenue}
                    min={1}
                    max={20}
                    step={0.1}
                  />
                  <InputControl
                    label="每千次独立访客的SaaS收入 (美元)"
                    value={saasRevenue}
                    onChange={setSaasRevenue}
                    min={50}
                    max={500}
                    step={10}
                  />
                  <InputControl
                    label="每个独立访客的页面浏览量"
                    value={pvPerUv}
                    onChange={setPvPerUv}
                    min={1}
                    max={5}
                    step={0.1}
                  />
                  <InputControl
                    label="关键词难度 (KD)"
                    value={keywordKD}
                    onChange={setKeywordKD}
                    min={0}
                    max={90}
                    step={10}
                    info={`所需反向链接域名数: ${kdToReferringDomains[keywordKD]}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">计算详情</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>
                    月收入 ${monthlyIncome} 除以 30 天 = 日目标 $
                    {results.dailyIncome}
                  </li>
                  <li>
                    每位访客产生 ${results.adRevenuePerUv} 广告收入 + $
                    {results.saasRevenuePerUv} SaaS收入 = $
                    {results.revenuePerUv}
                  </li>
                  <li>
                    实现日收入 ${results.dailyIncome}，所需总访客数:{" "}
                    {results.totalDailyUv}
                  </li>
                  <li>
                    分布在 {websiteCount} 个网站上，每个网站所需访客:{" "}
                    {results.uvPerSite}
                  </li>
                  <li>
                    每个网站目标 {keywordsPerSite} 个关键词，排名位置{" "}
                    {rankPosition} 的点击率为 {rankClickRates[rankPosition]}
                    %，每个关键词所需日搜索量: {results.searchVolumePerKeyword}
                  </li>
                  <li>
                    每位访客产生 {pvPerUv} 次页面浏览，预期页面浏览量:{" "}
                    {results.pvPerSite}
                  </li>
                  <li>
                    基于关键词难度 KD {keywordKD}，需要{" "}
                    {results.requiredDomains} 个反向链接域名
                  </li>
                  <li>
                    预计链接建设成本 ${results.totalLinkCost}{" "}
                    (建议预算不超过6个月收入)
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* 右侧结果区域 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2 pt-4">
                  <CardDescription className="text-xs">
                    日收入目标
                  </CardDescription>
                  <CardTitle className="text-xl text-blue-600">
                    ${results.dailyIncome}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2 pt-4">
                  <CardDescription className="text-xs">
                    每位访客收入
                  </CardDescription>
                  <CardTitle className="text-xl text-blue-600">
                    ${results.revenuePerUv}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2 pt-4">
                  <CardDescription className="text-xs">
                    每个网站所需日访客
                  </CardDescription>
                  <CardTitle className="text-xl text-blue-600">
                    {results.uvPerSite}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2 pt-4">
                  <CardDescription className="text-xs">
                    每个网站预期日页面浏览
                  </CardDescription>
                  <CardTitle className="text-xl text-blue-600">
                    {results.pvPerSite}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2 pt-4">
                  <CardDescription className="text-xs">
                    每个关键词所需日搜索量
                  </CardDescription>
                  <CardTitle className="text-xl text-blue-600">
                    {results.searchVolumePerKeyword}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2 pt-4">
                  <CardDescription className="text-xs">
                    每个网站所需反向链接域名
                  </CardDescription>
                  <CardTitle className="text-xl text-blue-600">
                    {results.requiredDomains}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card
                className={`transition-all hover:shadow-md ${
                  results.totalLinkCost > monthlyIncome * 6
                    ? "bg-red-50 border-red-200"
                    : ""
                }`}
              >
                <CardHeader className="pb-2 pt-4">
                  <CardDescription className="text-xs">
                    预计总链接建设成本
                  </CardDescription>
                  <CardTitle
                    className={`text-xl ${
                      results.totalLinkCost > monthlyIncome * 6
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    ${results.totalLinkCost}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2 pt-4">
                  <CardDescription className="text-xs">
                    12个月预计收入
                  </CardDescription>
                  <CardTitle className="text-xl text-blue-600">
                    ${results.yearlyIncome}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card
                className={`transition-all hover:shadow-md ${
                  results.roi < 1 ? "bg-red-50 border-red-200" : ""
                }`}
              >
                <CardHeader className="pb-2 pt-4">
                  <CardDescription className="text-xs">
                    ROI (12个月收入/链接成本)
                  </CardDescription>
                  <CardTitle
                    className={`text-xl ${
                      results.roi < 1 ? "text-red-600" : "text-blue-600"
                    }`}
                  >
                    {results.roi}x
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* 策略分析 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-blue-600" />
                  策略分析报告
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  要实现月收入目标{" "}
                  <span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
                    ${formatNumber(monthlyIncome)}
                  </span>
                  ， 通过{" "}
                  <span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
                    {websiteCount}
                  </span>{" "}
                  个网站， 每个网站目标{" "}
                  <span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
                    {keywordsPerSite}
                  </span>{" "}
                  个关键词。 日收入目标为{" "}
                  <span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
                    ${results.dailyIncome}
                  </span>
                  。
                </p>

                <p>
                  基于当前设置，每位访客价值包括： 广告收入{" "}
                  <span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
                    ${results.adRevenuePerUv}
                  </span>{" "}
                  + SaaS收入{" "}
                  <span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
                    ${results.saasRevenuePerUv}
                  </span>{" "}
                  = 总价值{" "}
                  <span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
                    ${results.revenuePerUv}
                  </span>
                  。 每位访客平均浏览{" "}
                  <span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
                    {pvPerUv}
                  </span>{" "}
                  个页面。
                </p>

                {(results.risks.highSearchVolume ||
                  results.risks.lowRoi ||
                  results.risks.highCost ||
                  results.risks.inefficientKD) && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="font-medium text-red-700 flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      优化建议：
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc text-slate-700">
                      {results.risks.inefficientKD && (
                        <li>
                          当前关键词难度 (KD: {keywordKD}) 较高但日搜索量 (
                          {formatNumber(results.searchVolumePerKeyword)})
                          较低，导致ROI不佳。建议：
                          <ul className="mt-1 ml-4 space-y-1 list-disc text-slate-600">
                            <li>寻找相关但难度更低的关键词</li>
                            <li>选择搜索量更高的关键词</li>
                            <li>考虑长尾关键词策略</li>
                          </ul>
                        </li>
                      )}
                      {results.risks.highSearchVolume && (
                        <li>
                          当前所需搜索量 (
                          {formatNumber(results.searchVolumePerKeyword)})
                          过高，考虑增加网站数量、增加关键词数量或调整收入预期
                        </li>
                      )}
                      {results.risks.lowRoi && (
                        <li>
                          当前ROI ({results.roi}x)
                          较低，考虑提高用户价值或降低获取成本
                        </li>
                      )}
                      {results.risks.highCost && (
                        <li>
                          链接建设成本 (${formatNumber(results.totalLinkCost)})
                          过高，考虑目标难度更低的关键词
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <div className="bg-slate-50 p-3 rounded-lg my-3 text-slate-600 text-xs">
            <p className="font-medium">📢 免责声明</p>
            <p>
              本工具基于SEO行业经验提供估算。结果仅供参考。实际结果可能受多种因素影响，包括：搜索引擎算法变化、市场竞争、网站质量、内容价值等。请根据具体情况谨慎决策。
            </p>
          </div>

          <div className="text-slate-400 text-xs">
            <p>
              © 2025 SEO收入目标计算器{" "}
              <span className="mx-2 text-slate-300">|</span> 保留所有权利
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
