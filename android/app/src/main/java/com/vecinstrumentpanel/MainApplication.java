package com.vecinstrumentpanel;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import org.capslock.RNDeviceBrightness.RNDeviceBrightness;
import com.horcrux.svg.RNSvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import me.rafaa.react.LockManagerModule;
import com.devstepbcn.wifi.AndroidWifiPackage;
import com.peel.react.TcpSocketsModule;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.github.yamill.orientation.OrientationPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNDeviceBrightness(),
            new RNSvgPackage(),
            new VectorIconsPackage(),
            new LockManagerModule(),
            new AndroidWifiPackage(),
            new TcpSocketsModule(),
            new KCKeepAwakePackage(),
            new OrientationPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
