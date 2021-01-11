function generateDefaultExample() {
	// Generate a random default example if it's not provided by the MTH_INPUT parameter in the URL
	var exp = document.getElementById("id_formula");
	exp.value = "";
	
	s = location.toString().split("?");
	if (s.length > 1) {
		s = s[1].split("&");
		for(var i = 0; i < s.length; i++) {
			u = s[i].split("=");
			if (u[0] == "MTH_INPUT") 
				exp.value = decodeURIComponent(u[1]);
		}
	}
		
	if (exp.value == "") {
		var Examples = [
			"(x+1+(2x+2)/(x-1))*(x/(x2+x))",
			"{(2/3-1/9)^2:[3/5:(2-1/5)]^4}*(1/5)^3+3",
			"x2-5x+6=0",
			"-ba^2-2ba+b^2-b+x^2+2xb=0",
			"(a4-b4)/(a2-b2)-(a+b)^4/(a+b)^2+1/2a*root(3)(b3+3b2+3b+1)"
		];
		
		exp.value = Examples[Math.floor(Math.random() * 5)];
	}
	
	//hideKeyboard();
	displayPreview();
}


function loadFrame(language) {
      var iframe = document.getElementById("myframe");
      var doc = iframe.contentWindow.document;
      var res = document.getElementById("resultPrint");

      res.innerHTML = doc.body.innerHTML;

      // Change default html tag of result
      res.innerHTML = res.innerHTML.replace(/<pre/g, "<p");
      res.innerHTML = res.innerHTML.replace(/pre>/g, "p>");

      // Format result in html for MathJax (ASCII MATH)
      res.innerHTML = res.innerHTML.replace(/`\n`/g, "`</p><p>`");
      res.innerHTML = res.innerHTML.replace(/=`\n/g, "`</p><p>");
      res.innerHTML = res.innerHTML.replace(/`\n/g, "`</p><p>");
      res.innerHTML = res.innerHTML.replace(/\n<\x2fp/g, "</p");

      // Manage monomials
      var patt = /[0-9]\x2a[a-z]/i;
      var s = new String(patt.exec(res.innerHTML));
      var a = "";
      while (s.valueOf() != "null") {
        a = s.charAt(0) + s.charAt(2);
        res.innerHTML = res.innerHTML.replace(s.valueOf(), a);
        s = new String(patt.exec(res.innerHTML));
      }

      /* Removed as MathJax does not display correctly xx, bb, cc ...
      patt = /[a-z]\x2a[a-z]/i;
      s = new String(patt.exec(res.innerHTML));
      while (s.valueOf()!="null") {
        a = s.charAt(0)+s.charAt(2);
        res.innerHTML = res.innerHTML.replace(s.valueOf(), a);
        s = new String(patt.exec(res.innerHTML));
      }
      */

      patt = /[a-z][0-9]/i;
      s = new String(patt.exec(res.innerHTML));
      while (s.valueOf() != "null") {
        a = s.charAt(0) + "^" + s.charAt(1);
        res.innerHTML = res.innerHTML.replace(s.valueOf(), a);
        s = new String(patt.exec(res.innerHTML));
      }

      // Manage ROOT operator
      res.innerHTML = res.innerHTML.replace(/;/g, ")(");
      res.innerHTML = res.innerHTML.replace(/&gt;\x29\x28/g, ">");
      res.innerHTML = res.innerHTML.replace(/&ge;\x29\x28/g, ">=");
      res.innerHTML = res.innerHTML.replace(/&lt;\x29\x28/g, "<");
      res.innerHTML = res.innerHTML.replace(/&le;\x29\x28/g, "<=");
      res.innerHTML = res.innerHTML.replace(/&amp;\x29\x28/g, "&");

      // Manage some MathJax's displays
      res.innerHTML = res.innerHTML.replace(/xx/g, 'x*x'); // xx is not displayed as wanted
      res.innerHTML = res.innerHTML.replace(/bb/g, 'b*b'); // bb is not displayed as wanted
      res.innerHTML = res.innerHTML.replace(/cc/g, 'c*c'); // cc is not displayed as wanted
    }

    // Not used; for future developments
    // To be used only if InputType.value = 1
    function displayExpResult() {
      var iframe = document.getElementById("myframe");
      var doc = iframe.contentWindow.document;
      var copyable_res = doc.body.innerHTML;

      copyable_res = copyable_res.replace(/`\n</g, "`<");
      copyable_res = copyable_res.replace(/`.*`\n/g, "");
      copyable_res = copyable_res.replace(/<pre.*>`=/g, "");
      copyable_res = copyable_res.replace(/=`.*pre>/g, "");
      alert(copyable_res);
    }


    function submitCalculationStart() {
      var message = document.getElementById("ResultMessage");
      message.innerHTML = "Calculation in progress ...";

      submitCalculation("E");
    }

    function loadFrameStart() {
      loadFrame("E");

      // Set the execution label
      var res = document.getElementById("resultPrint");
      var patt = /ERROR/;
      var execution_label = "execution ok";
      if (patt.test(res.innerHTML)) {
        execution_label = "execution with error";
        res.innerHTML = res.innerHTML.replace(/-ERROR-/, "");
      }

      // Typeset result
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

      // Display result label
      var message = document.getElementById("ResultMessage");
      if (message.innerHTML != "RESULT") {
        message.innerHTML = "RESULT";
        message.scrollIntoView(true);
      }

    }

    function displayPreview() {
      var exp = document.getElementById("id_formula");

      var prw = document.getElementById("InputPreview");
      prw.innerHTML = exp.value.toLowerCase(); // In order to avoid ambiguity, upper case variables are converted to lower case

      // Manage bad chars
      prw.innerHTML = prw.innerHTML.replace(/(\x7C|\x02|\x03|\x04|\x05|\x08|\x09|\x20|\x22|\x27|\x3F|\x5C|\uFE0F|\u25AF)/g, ''); // pipe char (as cursor) and bad chars to be removed
      prw.innerHTML = prw.innerHTML.replace(/(\xD7|\xB7|\u2022|\u22C5|\u2716)/g, '*'); // bad char of multiplication
      prw.innerHTML = prw.innerHTML.replace(/\xF7/g, ':'); // bad char of division
      prw.innerHTML = prw.innerHTML.replace(/(\u2212|\u2013|\u23AF|\x5F|\xAD)/g, '-'); // bad char of subtraction
      prw.innerHTML = prw.innerHTML.replace(/\u02C6/g, '^');  // bad char of raising to a power
      prw.innerHTML = prw.innerHTML.replace(/=&gt;/g, '>=');  // bad inequalities
      prw.innerHTML = prw.innerHTML.replace(/=&lt;/g, '<=');  // bad inequalities

      // Manage not useful signs
      prw.innerHTML = prw.innerHTML.replace(/\x5e+/g, '^'); // ^^
      prw.innerHTML = prw.innerHTML.replace(/\x2a+/g, '*'); // **
      prw.innerHTML = prw.innerHTML.replace(/\x2f+/g, '/'); // //
      prw.innerHTML = prw.innerHTML.replace(/\x2b+/g, '+'); // ++
      prw.innerHTML = prw.innerHTML.replace(/\x5e\x2b/g, '^'); // ^+
      prw.innerHTML = prw.innerHTML.replace(/\x2a\x2b/g, '*'); // *+
      prw.innerHTML = prw.innerHTML.replace(/\x2f\x2b/g, '/'); // /+
      prw.innerHTML = prw.innerHTML.replace(/\x3a\x2b/g, ':'); // :+
      prw.innerHTML = prw.innerHTML.replace(/\x24\x2b/g, '$'); // $+
      prw.innerHTML = prw.innerHTML.replace(/\x26\x2b/g, '&'); // &+

      // Manage monomials
      patt = /[a-z][0-9]/i;
      s = new String(patt.exec(prw.innerHTML));
      while (s.valueOf() != "null") {
        a = s.charAt(0) + "^" + s.charAt(1);
        prw.innerHTML = prw.innerHTML.replace(s.valueOf(), a);
        s = new String(patt.exec(prw.innerHTML));
      }

      // Manage some MathJax's displays
      prw.innerHTML = prw.innerHTML.replace(/xx/g, 'x*x'); // xx is not displayed as wanted
      prw.innerHTML = prw.innerHTML.replace(/bb/g, 'b*b'); // bb is not displayed as wanted
      prw.innerHTML = prw.innerHTML.replace(/cc/g, 'c*c'); // cc is not displayed as wanted

      // Typeset preview
      prw.innerHTML = "`" + prw.innerHTML + "`";
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }

    function submitCalculation(language) {
      // Hide the keyboard buttons
      //hideKeyboard();

      // Hide the help texts
      //var help = document.getElementById("dropdownhelp");
      //help.style.display = "none";

      // Set-up calculation
      var exp = document.getElementById("id_formula");
      var mth = document.getElementById("MthInput");
      mth.value = exp.value.toLowerCase(); // In order to avoid ambiguity, upper case variables are converted to lower case

      // Manage bad chars
      mth.value = mth.value.replace(/(\x02|\x03|\x04|\x05|\x08|\x09|\x20|\x22|\x27|\x3F|\x5C|\uFE0F)/g, ''); // bad chars to be removed
      mth.value = mth.value.replace(/(\xD7|\xB7|\u2022|\u22C5|\u2716)/g, '*'); // bad char of multiplication
      mth.value = mth.value.replace(/\xF7/g, ':'); // bad char of division
      mth.value = mth.value.replace(/(\u2212|\u2013|\u23AF|\x5F|\xAD)/g, '-'); // bad char of subtraction
      mth.value = mth.value.replace(/\u02C6/g, '^');  // bad char of raising to a power 
      mth.value = mth.value.replace(/=>/g, '>=');  // bad inequalities
      mth.value = mth.value.replace(/=</g, '<=');  // bad inequalities

      // Only managed when submitting calculation - begin
      mth.value = mth.value.replace(/(\xBA|\xB0)/g, '^0');	// 0 superscript
      mth.value = mth.value.replace(/\xB9/g, '^1');			// 1 superscript
      mth.value = mth.value.replace(/\xB2/g, '^2');			// 2 superscript
      mth.value = mth.value.replace(/\xB3/g, '^3');			// 3 superscript
      mth.value = mth.value.replace(/\u2074/g, '^4');			// 4 superscript
      mth.value = mth.value.replace(/\u207F/g, '^n');			// n superscript
      mth.value = mth.value.replace(/\xAA/g, '^a');			// a superscript
      mth.value = mth.value.replace(/\xBC/g, '(1/4)');  // bad fractions
      mth.value = mth.value.replace(/\xBD/g, '(1/2)');  // bad fractions
      mth.value = mth.value.replace(/\xBE/g, '(3/4)');  // bad fractions
      mth.value = mth.value.replace(/\u2154/g, '(2/3)');  // bad fractions
      // end

      // Manage not useful signs
      mth.value = mth.value.replace(/\x5e+/g, '^'); // ^^
      mth.value = mth.value.replace(/\x2a+/g, '*'); // **
      mth.value = mth.value.replace(/\x2f+/g, '/'); // //
      mth.value = mth.value.replace(/\x2b+/g, '+'); // ++
      mth.value = mth.value.replace(/\x5e\x2b/g, '^'); // ^+
      mth.value = mth.value.replace(/\x2a\x2b/g, '*'); // *+
      mth.value = mth.value.replace(/\x2f\x2b/g, '/'); // /+
      mth.value = mth.value.replace(/\x3a\x2b/g, ':'); // :+
      mth.value = mth.value.replace(/\x24\x2b/g, '$'); // $+
      mth.value = mth.value.replace(/\x26\x2b/g, '&'); // &+

      // Deletion of = at the end of expression
      mth.value = mth.value.replace(/=$/, '');

      // Manage decimals
      var patt = /[0-9]+(\x2e|\x2c)[0-9]*\x28[0-9]+\x29/;
      var s = new String(patt.exec(mth.value));
      while (s.valueOf() != "null") {
        s = s.valueOf().substr(0, s.length - 2);
        var i1 = s.valueOf().search(/(\x2e|\x2c)/);
        var i2 = s.valueOf().search(/\x28/);
        var i3 = s.valueOf().search(/\x29/);
        var int_part = s.valueOf().substring(0, i1);
        var ante_period = s.valueOf().substring(i1 + 1, i2);
        var period = s.valueOf().substring(i2 + 1, i3);
        var a = "((" + int_part + ante_period + period + "-" + int_part + ante_period + ")/";
        i3 = period.length;
        while (i3-- > 0) a = a + "9";
        i2 = ante_period.length;
        while (i2-- > 0) a = a + "0";
        a = a + ")";
        mth.value = mth.value.replace(s.valueOf(), a);
        var s = new String(patt.exec(mth.value));
      }

      patt = /[0-9]+(\x2e|\x2c)[0-9]+/;
      s = new String(patt.exec(mth.value));
      while (s.valueOf() != "null") {
        s = s.valueOf().substr(0, s.length - 2);
        i1 = s.valueOf().search(/(\x2e|\x2c)/);
        int_part = s.valueOf().substring(0, i1);
        ante_period = s.valueOf().substring(i1 + 1);
        a = "((" + int_part + ante_period + ")/";
        a = a + "1";
        i2 = ante_period.length;
        while (i2-- > 0) a = a + "0";
        a = a + ")";
        mth.value = mth.value.replace(s.valueOf(), a);
        s = new String(patt.exec(mth.value));
      }

      // Interpret . as a multiplication, if not used for decimals
      mth.value = mth.value.replace(/\x2e/g, '*');

      // Insert closing brackets at the bottom of expression, if missed
      var brackets_balance = 0;
      var strmatch = mth.value.match(/[\x28\x5b\x7b]/g);
      if (strmatch != null) {
        brackets_balance = strmatch.length;
        strmatch = mth.value.match(/[\x29\x5d\x7d]/g);
        if (strmatch != null) brackets_balance -= strmatch.length;
      }
      while (brackets_balance-- > 0) mth.value = mth.value + ")";

      // Generate errors for the CGI (if any)
      var InputError = document.getElementById("InputError");
      InputError.value = "0"; // NO_ERRORS

      if (!mth.value)
        InputError.value = "-17"; // EMPTY_EXPRESSION
      else {
        var n = mth.value.search(/(#|arccos|arcsin|arctan|cos|cosh|cot|coth|csc|csch|det|dim|exp|gcd|glb|lcm|ln|log|lub|max|min|mod|sec|sech|sin|sinh|tan|tanh|abs|floor|ceil|int|\u221A|\x7C|\x21|\x40)/i);
        if (n >= 0) InputError.value = "-13"; // FUNCTION_NOT_SUPPORTED
      }

      // Set the input type
      var InputType = document.getElementById("InputType");
      InputType.value = "1"; // Expression

      if (InputError.value == "0") {
        // Manage SQRT and ROOT
        mth.value = mth.value.replace(/sqrt/gi, '@');
        mth.value = mth.value.replace(/root/gi, '|');

        // Manage ROOT operator - Begin
        var i = -1;
        var brackets_level = 0;
        while (++i < mth.value.length)
          if (mth.value.charAt(i) == "|" && i + 1 < mth.value.length && (mth.value.charAt(i + 1) == "(" || mth.value.charAt(i + 1) == "[" || mth.value.charAt(i + 1) == "{")) {
            brackets_level = 1;
            i++;
          }
          else
            if (brackets_level > 0 && (mth.value.charAt(i) == "(" || mth.value.charAt(i) == "[" || mth.value.charAt(i) == "{"))
              ++brackets_level;
            else
              if (brackets_level > 0 && (mth.value.charAt(i) == ")" || mth.value.charAt(i) == "]" || mth.value.charAt(i) == "}"))
                if (brackets_level - 1 == 0 && i + 1 < mth.value.length && (mth.value.charAt(i + 1) == "(" || mth.value.charAt(i + 1) == "[" || mth.value.charAt(i + 1) == "{")) {
                  mth.value = mth.value.substring(0, i) + ";" + mth.value.substring(i + 2);
                  brackets_level = 0;
                }
                else
                  --brackets_level;
        // Manage ROOT operator - End

        // Manage equations and inequalities
        n = -1;
        if (n == -1) n = mth.value.search(/>=/);
        if (n >= 0) {
          mth.value = mth.value.replace(/>=/, "-{");
          mth.value = mth.value + "}";
          InputType.value = "2"; // Inequality 2 ">="
          n = -2;
        }
        if (n == -1) n = mth.value.search(/<=/);
        if (n >= 0) {
          mth.value = mth.value.replace(/<=/, "-{");
          mth.value = mth.value + "}";
          InputType.value = "3"; // Inequality 3 "<="
          n = -2;
        }
        if (n == -1) n = mth.value.search(/=/);
        if (n >= 0) {
          mth.value = mth.value.replace(/=/, "-{");
          mth.value = mth.value + "}";
          InputType.value = "4"; // Equation
          n = -2;
        }
        if (n == -1) n = mth.value.search(/>/);
        if (n >= 0) {
          mth.value = mth.value.replace(/>/, "-{");
          mth.value = mth.value + "}";
          InputType.value = "5"; // Inequality 5 ">"
          n = -2;
        }
        if (n == -1) n = mth.value.search(/</);
        if (n >= 0) {
          mth.value = mth.value.replace(/</, "-{");
          mth.value = mth.value + "}";
          InputType.value = "6"; // Inequality 6 "<"
          n = -2;
        }
        mth.value = mth.value.replace(/-\x7b0\x7d/, ""); // Remove "-{0}"

        // Manage monomials
        patt = /[0-9][a-z]/i;
        s = new String(patt.exec(mth.value));
        a = "";
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "#" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        patt = /[a-z][a-z]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "#" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        patt = /[a-z][0-9]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "^" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        // Manage implicit multiplications
        patt = /[0-9][\x28\x5b\x7b]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "*" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        patt = /[a-z][\x28\x5b\x7b]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "*" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        patt = /[\x29\x5d\x7d][\x28\x5b\x7b]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "*" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        patt = /[\x29\x5d\x7d][a-z]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "*" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        patt = /[\x29\x5d\x7d][0-9]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "*" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        // Manage implicit multiplications in relation to roots
        patt = /[0-9][\x40\x7c]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "*" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        patt = /[a-z][\x40\x7c]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "*" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }

        patt = /[\x29\x5d\x7d][\x40\x7c]/i;
        s = new String(patt.exec(mth.value));
        while (s.valueOf() != "null") {
          a = s.charAt(0) + "*" + s.charAt(1);
          mth.value = mth.value.replace(s.valueOf(), a);
          s = new String(patt.exec(mth.value));
        }
      }
      else InputType.value = "0"; // Error input type
    }

    function Digitar(valorParametro) {
      var elemento = document.getElementById("id_formula");
      var valorAtual = elemento.value;
      elemento.value = valorAtual + valorParametro;


      var formula_1 = document.getElementById("formula_1");
      formula_1.value = '\[' + elemento.value + '\]';

      // Calcular_expressao();
    }
    function Calcular_expressao() {
      submitCalculationStart();
      // submitCalculation("E");
      loadFrameStart();
    }


    function Deletar_expressao() {
      var elemento = document.getElementById("id_formula");
      var resultado = document.getElementById("resultado");
      elemento.value = "";
      resultado.value = "";
    }

