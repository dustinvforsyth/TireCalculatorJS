$(document).ready(function () {

    var tire1Input = {};
    var tire2Input = {};
    var ConvertedTire1Size = {};
    var ConvertedTire2Size = {};
    var TireDiffs = {};
    var tirePercentChanges = {};

    var tire1Fields = {
        sidewall: '#sidewall1',
        width: '#width1',
        diameter: '#diameter1',
        circumference: '#circum1',
        RPM: '#revolutions1',
        MPH: '#mph1',
        odometer: '#odometer1'
    }
    var tire2Fields = {
        sidewall: '#sidewall2',
        width: '#width2',
        diameter: '#diameter2',
        circumference: '#circum2',
        RPM: '#revolutions2',
        MPH: '#mph2',
        odometer: '#odometer2',
    }

    var differences = {
        sidewall: '#sidewallDifference',
        width: '#widthDifference',
        diameter: '#diameterDifference',
        circumference: '#circumDifference',
        RPM: '#revolutionsDifference',
        MPH: '#mphDifference',
        odometer: '#odometerDifference'
    }
    var percentChangeFields = {
        sidewall: '#sidewallChangePercent',
        width: '#widthChangePercent',
        diameter: '#diameterChangePercent',
        circumference: '#circumChangePercent',
        RPM: '#revolutionsChangePercent',
        MPH: '#mphChangePercent',
        odometer: '#odometerChangePercent'
    }

    var getTire1 = function () {
        tire1Input = {
            SectionWidth: $("#sectionWidth1").val(),
            SectionHeight: $("#sectionHeight1").val(),
            rimSize: $("#rimSize1").val(),
            ddlspeed: $('#ddlspeed').val(),
            odometer: $('#odometerField').val()
        };
    };
    var getTire2 = function () {
        tire2Input = {
            SectionWidth: $("#sectionWidth2").val(),
            SectionHeight: $("#sectionHeight2").val(),
            rimSize: $("#rimSize2").val()
        }
    }

    var setTireValueFields = function (tireFields, tireValues) {
        $(tireFields.sidewall).text(Math.ceil(tireValues.sidewallHeight * 100)/100);
        $(tireFields.width).text(Math.ceil(tireValues.width *100)/100);
        $(tireFields.diameter).text(Math.ceil(tireValues.diameter*100)/100);
        $(tireFields.circumference).text(Math.ceil(tireValues.circumference*100)/100);
        $(tireFields.RPM).text(Math.ceil(tireValues.RPM*100)/100);
        $(tireFields.MPH).text(Math.ceil(tireValues.MPH));
        $(tireFields.odometer).text(Math.ceil(tireValues.odometer));
    }

    var convertTireSize = function (tire, ConvertedTireSize) {

        var rimSize = parseInt(tire.rimSize);
        var sectionWidth = parseInt(tire.SectionWidth);
        var sectionHeight = parseInt(tire.SectionHeight)
        //This Checks to make sure the tire is Metric so it knows to convert if needed.
        if (sectionWidth > 50 || sectionHeight > 20) {
            var inchWidth = sectionWidth / 25.4;
            var aspectRatio = sectionHeight / 100;
            var sidewallheight = (inchWidth * aspectRatio);

            ConvertedTireSize.sidewallHeight = sidewallheight;
            ConvertedTireSize.diameter = ((sidewallheight * 2) + rimSize);
            ConvertedTireSize.width = inchWidth;
        }
        else {
            ConvertedTireSize.sidewallHeight = (sectionWidth - rimSize) / 2;
            ConvertedTireSize.diameter = sectionWidth;
            ConvertedTireSize.width = tire.SectionHeight;
        }
        ConvertedTireSize.rimSize = tire.rimSize;
    };


    var calcCircumference = function (ConvertedTireSize) {
        ConvertedTireSize.circumference = ConvertedTireSize.diameter * Math.PI;
    };

    var calcRevPerMile = function (ConvertedTireSize) {
        ConvertedTireSize.RPM = (5278.8 * 12) / ConvertedTireSize.circumference;
    };

    var calcMph = function (ConvertedTireSize) {
        if (ConvertedTireSize == ConvertedTire1Size) {
            ConvertedTireSize.MPH = tire1Input.ddlspeed;
        }
        else {
            ConvertedTireSize.MPH = (ConvertedTire1Size.RPM / ConvertedTire2Size.RPM) * tire1Input.ddlspeed;
        }
    };

    var Odometer = function (ConvertedTire1, ConvertedTire2) {
        var odometerReading = parseInt(tire1Input.odometer);
        var percentChange = (TireDiffs.diameter / ConvertedTire1.diameter);
        var odometerDifference = Math.ceil(odometerReading * percentChange);  
        var newOdometerReading = odometerDifference + odometerReading;

        ConvertedTire1.odometer = odometerReading;
        ConvertedTire2.odometer = newOdometerReading;
        TireDiffs.odometer = odometerDifference;
        $('#odometer1').text(odometerReading);
        $('#odometer2').text(newOdometerReading);
        $('#odometerDifference').text(odometerDifference);
    };

    var tireDifferences = function (tire1, tire2) {
        TireDiffs.sidewallHeight = Math.ceil((tire2.sidewallHeight - tire1.sidewallHeight)*100)/100;
        TireDiffs.width = Math.ceil((tire2.width - tire1.width)*100)/100;
        TireDiffs.diameter = Math.ceil((tire2.diameter - tire1.diameter)*100)/100;
        TireDiffs.circumference = Math.ceil((tire2.circumference - tire1.circumference)*100)/100;
        TireDiffs.RPM = Math.ceil((tire2.RPM - tire1.RPM)*100)/100;
        TireDiffs.MPH = Math.ceil(tire2.MPH - tire1.MPH)
    };

    var percentChange = function (tire1, TireDiffs) {
        tirePercentChanges.sidewallHeight = (TireDiffs.sidewallHeight / tire1.sidewallHeight) * 100;
        tirePercentChanges.width = (TireDiffs.width / tire1.width) * 100;
        tirePercentChanges.diameter = (TireDiffs.diameter / tire1.diameter) * 100;
        tirePercentChanges.circumference = (TireDiffs.circumference / tire1.circumference) * 100;
        tirePercentChanges.RPM = (TireDiffs.RPM / tire1.RPM) * 100;
        tirePercentChanges.MPH = (TireDiffs.MPH / tire1.MPH) * 100;
        tirePercentChanges.odometer = (TireDiffs.odometer / tire1.odometer) * 100;
    }

    var calculation = function (tireInput, ConvertedTireSize, tireFields) {

        convertTireSize(tireInput, ConvertedTireSize);
        calcCircumference(ConvertedTireSize);
        calcRevPerMile(ConvertedTireSize);
        calcMph(ConvertedTireSize);

        setTireValueFields(tireFields, ConvertedTireSize);
    };

    var buildTable = function () {
        //doing tire calculations one at a time.
        getTire1();
        getTire2();
        calculation(tire1Input, ConvertedTire1Size, tire1Fields);
        calculation(tire2Input, ConvertedTire2Size, tire2Fields);
        //setting tire fields
        tireDifferences(ConvertedTire1Size, ConvertedTire2Size);
        //Differences between Tires
        setTireValueFields(differences, TireDiffs);
        //getting odometer calculations
        Odometer(ConvertedTire1Size, ConvertedTire2Size);
        //Percent change calculations
        percentChange(ConvertedTire1Size, TireDiffs);
        //setting percent fields
        setTireValueFields(percentChangeFields, tirePercentChanges);
    }


    $("#BtnCalculate").on("click", function () {
        buildTable();
    })
})

