const fs = require('fs');

let dashboardCode = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

// I'll just append it to the end of fetchData
dashboardCode = dashboardCode.replace(
  /setFoodCategories\(fc\);\n\s*setPlaces\(p\);\n\s*\}/,
  `setFoodCategories(fc);
    setPlaces(p);
    weddingApi.getFaqs().then(setFaqs);
  }`
);

fs.writeFileSync('src/components/admin/AdminDashboard.tsx', dashboardCode);
