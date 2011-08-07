package name.shamansir.xtd;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

public class XtdActivity extends Activity {    
    
    private static final String TAG = "XtdActivity";
    
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
     
        Context cx = Context.enter();
        cx.setLanguageVersion(Context.VERSION_1_7);
        cx.setOptimizationLevel(-1);
        Scriptable scope = cx.initStandardObjects();
        InputStream calcParser = null;
        try {
            calcParser = getAssets().open("calc-parser.js");
            cx.evaluateReader(scope, new InputStreamReader(calcParser),
                    "calc-parser", 0, null);
            cx.evaluateString(scope, "result = CalcParser.parse('(3+4)*2+2*3')", "res", 0, null);
            Double value = (Double) scope.get("result", scope);
            Log.v(TAG, String.valueOf(value));        
        } catch (IOException e) {
            Log.e(TAG, e.getMessage());
        } finally {
            try {
                if (calcParser != null) calcParser.close();
            } catch (IOException e) {
                Log.e(TAG, e.getMessage());
            }
        }
    }
    
}