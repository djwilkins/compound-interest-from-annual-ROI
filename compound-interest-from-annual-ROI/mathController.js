var app = angular.module('myApp',[]);

app.controller('myCtrl', function($scope) {
    $scope.annualReturnOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    $scope.paymentPeriods = [
        { desc: 'weekly', paymentsInYear: 52 },
        { desc: 'bi-weekly', paymentsInYear: 26 },
        { desc: 'monthly', paymentsInYear: 12 },
        { desc: 'quarterly', paymentsInYear: 4 }
    ];
    $scope.showTableHidden=[true,'Show'];
    $scope.growthModelData=[];
    $scope.annualReturnSelected = function() {
        if ($scope.areBothOptionsDefined()) {
            $scope.calculatePayPeriodRate();
        }
    }
    $scope.paymentPeriodSelected = function() {
        // Grab the array of objects position of the selected payment period in a variable:
        let pos = $scope.paymentPeriods.map(function(e) { return e.desc; }).indexOf($scope.paymentPeriodChoice);
        $scope.paymentPeriodsPerYear = $scope.paymentPeriods[pos].paymentsInYear;
        // Run calculate Pay Period Rate to generate if both options selected:
        if ($scope.areBothOptionsDefined()) {
            $scope.calculatePayPeriodRate();
        }
    }
    $scope.areBothOptionsDefined = function() {
        // Make sure that both select boxes have options selected:
        if ($scope.annualReturnChoice !== undefined && $scope.paymentPeriodChoice !== undefined) {
            // Return true if both options selected:
            return true;
        } else {
            return false;
        }
    }

    $scope.calculatePayPeriodRate = function() {
        // Put annual rate into calculatable form:
        // Parse number only (remove '%' from select annual ROI option)
        let annualRate = 1 + (parseInt($scope.annualReturnChoice) / 100);

        // Get x (payment periods per year) root of annual rate:
        $scope.ratePerPeriod = Math.pow(annualRate, 1/$scope.paymentPeriodsPerYear);

        // Remove 1 (for principle) and multiple by 100 to get readable % for user output:
        let readableRatePerPeriod = ((($scope.ratePerPeriod - 1)*100) + "%");

        // Update short term period rate % in user interface:
        $scope.ratePerPeriodOutput = readableRatePerPeriod;

    }

    // This function runs when the user clicks to "Show" (later "Refresh") button
    $scope.showPayPeriodGrowth = function() {
        // Only procede in user has selected both options, as need for basis of modeling growth below:
        if ($scope.areBothOptionsDefined()) {
            $scope.showButtonMessage = "";
            $scope.showTableHidden=[false,'Refresh'];
            // Populate array for each pay period:
            let yearGrowthModeling=[], step, startingValue=100, growthValue, closingValue;
            let principlePlusGrowth = $scope.ratePerPeriod;
            let growthOnlyRate = $scope.ratePerPeriod - 1;

            for (step = 1; step <= $scope.paymentPeriodsPerYear; step++) {
                growthAmount = (startingValue * growthOnlyRate).toFixed(5);
                closingValue = startingValue * principlePlusGrowth;
                yearGrowthModeling.push({period:step, startValue:startingValue, growthAmt: growthAmount, closeValue:closingValue});
                startingValue = closingValue;
            }
            $scope.growthModelData=yearGrowthModeling;
            // console.log($scope.growthModelData);
        } else {
            $scope.showButtonMessage = "Please select both annual Return % and small period length first!";
        }
    }

});