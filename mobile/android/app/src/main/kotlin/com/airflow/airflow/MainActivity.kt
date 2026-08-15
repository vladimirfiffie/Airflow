package com.airflow.airflow

import io.flutter.embedding.android.FlutterFragmentActivity

// FlutterFragmentActivity rather than FlutterActivity: local_auth shows the
// system BiometricPrompt, which requires a FragmentActivity host. With plain
// FlutterActivity the unlock prompt throws at runtime instead of appearing.
class MainActivity : FlutterFragmentActivity()
