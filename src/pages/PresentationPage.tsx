import React, { useState, useRef, useEffect } from 'react';
import { Users, Building2, Package, AppWindow, Heart, Scale, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCostsStore, CostCategory } from '../data/costs';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type TooltipData = {
  x: number;
  y: number;
  name: string;
  value: string;
  percentage: number;
};

function PresentationPage() {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [chartRotation, setChartRotation] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const costs = useCostsStore((state) => state.costs);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartRotation(prev => (prev + 1) % 360);
    return () => clearInterval(interval);
  }, []);

  const totalMonthlyCosts = costs.reduce((sum, cost) => sum + cost.monthlyCost, 0);
  const totalAnnualCosts = totalMonthlyCosts * 12;

  const sortedCosts = costs
    .map((cost) => ({
      ...cost,
      percentage: Math.round((cost.monthlyCost / totalMonthlyCosts) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const categoryColors = {
    employeesPayroll: '#2563EB',   // Strong Blue
    officeRent: '#10B981',       // Strong Teal
    governmentObligations: '#FACC15', // Bright Yellow
    healthInsurance: '#F97316',    // Vivid Orange
    officeSupplies: '#8B5CF6',    // Vibrant Purple
    appsSubscriptions: '#A85532',  // Rich Brown
  };

  const getIcon = (iconName: string) => {
    const icons = {
      users: <Users className="w-8 h-8 text-white" />, // White icons for contrast
      building2: <Building2 className="w-8 h-8 text-white" />,
      scale: <Scale className="w-8 h-8 text-white" />,
      heart: <Heart className="w-8 h-8 text-white" />,
      package: <Package className="w-8 h-8 text-white" />,
      appWindow: <AppWindow className="w-8 h-8 text-white" />,
    };
    return icons[iconName as keyof typeof icons];
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(0)}`;
  };

  const costDescriptions = {
    employeesPayroll: 'Employee salaries',
    officeRent: 'Office rent costs',
    governmentObligations: 'Taxes & regulatory fees',
    healthInsurance: 'Employee health coverage',
    officeSupplies: 'Office supplies & bills',
    appsSubscriptions: 'Software subscriptions',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6 flex flex-col font-sans text-gray-900"> {/* Subtle background gradient */}
      <header className="px-6 py-3 flex items-center justify-between bg-transparent print:hidden"> {/* Transparent header */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors" // Indigo hover color
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span> {/* Slightly bolder back link */}
          </Link>
        </div>
      </header>

      <main className="max-w-full mx-auto space-y-12 flex-grow flex flex-col justify-center px-6 md:px-8 lg:px-12">
        {/* Presentation Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3">
            Cost Overview
          </h1>
          <p className="text-gray-600 text-xl md:text-2xl font-light"> {/* Lighter font weight for subtitle */}
            Expense Summary
          </p>
        </div>

        {/* Annual Cost Summary */}
        <div className="bg-indigo-500 text-white rounded-3xl p-12 flex flex-col items-center shadow-xl hover:shadow-2xl transition-shadow duration-300"> {/* Indigo background, more shadow */}
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 uppercase tracking-wider text-indigo-100"> {/* Lighter text for title */}
            Total Annual Costs
          </h2>
          <div className="text-7xl md:text-8xl lg:text-9xl font-bold text-center mb-4 "> {/* White text for value */}
            {formatCurrency(totalAnnualCosts)}
          </div>
          <p className="text-indigo-200 text-lg md:text-xl text-center font-light"> {/* Lighter text for description */}
            Projected annual expenses
          </p>
        </div>

        {/* Monthly Cost Distribution Overview */}
        <div className="rounded-3xl p-12 flex flex-col lg:flex-row items-center justify-around bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300"> {/* White bg, more shadow */}
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center lg:text-left lg:mb-0 lg:mr-12 uppercase tracking-wider text-gray-900"> {/* Darker text for title */}
            Monthly Distribution
          </h2>
          {/* Pie Chart */}
          <div className="relative w-full lg:w-1/2 max-w-md" ref={chartRef}>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart width={800} height={800}>
                <Pie
                  data={sortedCosts}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={160}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="monthlyCost"
                  labelLine={false}
                  // @ts-ignore
                  label={({ entry }) => (entry && entry.name ? `${entry.percentage}%` : '')}
                  labelPosition="inside"
                >
                  {sortedCosts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.name.replace(/\s+/g, '') as keyof typeof categoryColors] || '#a47148'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Cost Categories */}
        <div className="rounded-3xl p-12 overflow-hidden"> {/* Removed background color from categories section */}
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-gray-900 uppercase tracking-wider"> {/* Darker text for title */}
            Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-x-6">
            {costs.map((cost, index) => (
              <div key={cost.id} className={`p-6 rounded-xl flex flex-col items-start hover:bg-gray-50 transition-colors duration-200`}> {/* Hover background effect */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4`} style={{ backgroundColor: categoryColors[cost.name.replace(/\s+/g, '') as keyof typeof categoryColors] || '#a47148' }}> {/* Rounded icon background, category colors */}
                  {getIcon(cost.icon)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cost.name}</h3> {/* Darker text for category name */}
                <p className="text-lg text-gray-700 mb-2 font-medium"> {/* Slightly bolder cost text */}
                  {formatCurrency(cost.monthlyCost)}/month
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {costDescriptions[cost.name.replace(/\s+/g, '') as keyof typeof costDescriptions] || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="hidden print:block">
        <div className="text-center text-gray-500 text-sm mt-6">
          Cost Presentation by Lahim Tool
        </div>
      </div>
    </div>
  );
}

export default PresentationPage;
</boltArtifact>
```

Here's a breakdown of the changes for a more visibly modern presentation page:

- **Background Gradient:**  Added a subtle background gradient (`bg-gradient-to-br from-gray-100 to-white`) to give the page more depth and visual interest, moving away from a flat background.
- **Color Accents:**
    - **Indigo as Primary Accent:** Used indigo (`bg-indigo-500`, `text-indigo-600`, `text-indigo-800`) more prominently as a modern and professional accent color, especially for the "Annual Cost Summary" block.
    - **Vibrant Category Colors:**  Updated `categoryColors` to use stronger, more saturated versions of the previous modern color palette (Strong Blue, Strong Teal, Bright Yellow, Vivid Orange, Vibrant Purple, Rich Brown) to make the pie chart and category icons more visually impactful.
- **Typography Enhancements:**
    - **Slightly Bolder Fonts:** Used `font-medium` and `font-semibold` more liberally to make key text elements (like the back link and category costs) slightly bolder and more prominent.
    - **Lighter Font Weight for Subtitles:** Used `font-light` for subtitles to create a visual hierarchy and make the main titles stand out more.
    - **Uppercase Tracking for Titles:** Kept `uppercase tracking-wider` for section titles to maintain a modern, professional feel.
- **Shadows and Hover Effects:**
    - **More Pronounced Shadows:** Added more pronounced shadows (`shadow-xl`, `shadow-2xl`) to the "Annual Cost Summary" and "Monthly Cost Distribution Overview" blocks to give them more visual lift and make them stand out.
    - **Hover Shadow Effect:** Added a subtle `hover:shadow-2xl` and `transition-shadow duration-300` to these blocks to provide a subtle interactive feedback on hover.
    - **Category Block Hover Effect:** Added a `hover:bg-gray-50 transition-colors duration-200` to the category blocks to provide a subtle background color change on hover, indicating interactivity.
- **Visual Hierarchy and Spacing:**
    - **Transparent Header:** Made the header background transparent (`bg-transparent`) to blend seamlessly with the background gradient and reduce visual clutter at the top.
    - **Increased Spacing:** Maintained generous `space-y` values to ensure good spacing between sections.
    - **Rounded Corners:** Used `rounded-3xl` and `rounded-xl` consistently for a softer, more modern look.
- **Back Link Styling:**  Made the "Back to Dashboard" link more noticeable with an indigo hover color (`hover:text-indigo-600`) and slightly bolder text (`font-medium`).
- **Category Block Styling:**
    - **Rounded Icon Backgrounds:** Used `rounded-xl` for category icon backgrounds to match the overall rounded aesthetic.
    - **Category Colors for Icons:** Maintained the use of `categoryColors` for the icon backgrounds to visually link categories to colors.

These changes should result in a presentation page that is more visually engaging, clearly modern, and has a stronger sense of visual hierarchy and polish. The use of color, shadows, and typography is more deliberate and aims for a contemporary and professional presentation style.