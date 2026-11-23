package io.mindchess.app;

import android.os.Bundle;
import android.view.View;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        
        View decorView = getWindow().getDecorView();
        WindowInsetsControllerCompat controller = 
            WindowCompat.getInsetsController(getWindow(), decorView);
        controller.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
        
        ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, insets) -> {
            return WindowInsetsCompat.CONSUMED;
        });
    }
}