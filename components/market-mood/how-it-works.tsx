import { ArrowRightIcon, BarChart3Icon, BrainCircuitIcon, LineChartIcon, NewspaperIcon, UsersIcon } from "lucide-react"

export function HowItWorks() {
  return (
    <div className="space-y-12">
      <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
            <BrainCircuitIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">The Science Behind the Index</h3>
            <p className="text-muted-foreground">
              The Market Mood Index is a proprietary algorithm that analyzes multiple data points to gauge market
              sentiment. It combines technical indicators, investor surveys, options data, and news sentiment to create
              a comprehensive view of market psychology.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
            <BarChart3Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Reading the Scale</h3>
            <p className="text-muted-foreground">
              The index ranges from 0 to 100, with readings below 30 indicating extreme fear or bearishness, and
              readings above 70 indicating extreme greed or bullishness. The middle range (30-70) represents neutral
              market sentiment with varying degrees of optimism or pessimism.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Key Components</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
            <LineChartIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold">Technical Indicators</h4>
            <p className="text-sm text-muted-foreground">
              Analysis of market breadth, moving averages, relative strength, and momentum indicators.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
            <UsersIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold">Investor Surveys</h4>
            <p className="text-sm text-muted-foreground">
              Data from AAII, Investors Intelligence, and other sentiment surveys that track bullish vs. bearish
              sentiment.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
            <NewspaperIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold">News Sentiment</h4>
            <p className="text-sm text-muted-foreground">
              Natural language processing of financial news to gauge media sentiment and its impact on market
              psychology.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
            <BarChart3Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold">Options Data</h4>
            <p className="text-sm text-muted-foreground">
              Analysis of put/call ratios, volatility indices, and options positioning to understand market
              expectations.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">How to Use the Index</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Contrarian Indicator</h4>
              <p className="text-sm text-muted-foreground">
                Extreme readings (below 20 or above 80) often signal potential market reversals, as sentiment reaches
                unsustainable levels.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Trend Confirmation</h4>
              <p className="text-sm text-muted-foreground">
                Rising sentiment in the 30-70 range often confirms bullish trends, while falling sentiment in this range
                may confirm bearish trends.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Risk Management</h4>
              <p className="text-sm text-muted-foreground">
                Use the index to adjust portfolio risk - consider reducing exposure when sentiment becomes extremely
                bullish and increasing it when sentiment is extremely bearish.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
              4
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Historical Context</h4>
              <p className="text-sm text-muted-foreground">
                Compare current readings to historical patterns during similar market environments to gain additional
                insights.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <a
            href="#"
            className="inline-flex items-center text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Learn more about our methodology
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
