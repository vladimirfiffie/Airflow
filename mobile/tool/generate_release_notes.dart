// Renders lib/release_notes.dart into a GitHub release body.
//
//   dart run tool/generate_release_notes.dart v1.0.0 > RELEASE_NOTES.md
//
// Run from the `mobile/` directory. The release workflow pipes the output into
// the release body, above the auto-generated commit list.

import 'dart:io';

import 'package:airflow/release_notes.dart';

void main(List<String> args) {
  if (args.isEmpty) {
    stderr.writeln('usage: dart run tool/generate_release_notes.dart <tag>');
    exit(64); // EX_USAGE
  }

  final tag = args.first;
  final version = normalizeVersion(tag);
  final note = noteForVersion(version);

  if (note == null) {
    // A missing entry shouldn't throw away a six-minute build — the release
    // still publishes, with GitHub's own commit list as the body. The warning
    // annotation makes the omission visible in the run summary. Swap this for
    // `exit(1)` if you'd rather no release ship without written notes.
    stderr.writeln(
      '::warning::No lib/release_notes.dart entry for $version — '
      'publishing with an auto-generated body only.',
    );
    stdout.writeln('## Airflow $tag');
    stdout.writeln();
    stdout.writeln(
      '_No release notes were recorded for this version._',
    );
    return;
  }

  final buffer = StringBuffer()
    ..writeln('## Airflow $tag')
    ..writeln()
    ..writeln(note.headline)
    ..writeln();

  if (note.isPrerelease) {
    buffer
      ..writeln('> **Prerelease.** Expect rough edges.')
      ..writeln();
  }

  buffer.writeln("### What's new");
  buffer.writeln();
  for (final change in note.changes) {
    buffer.writeln('- $change');
  }
  buffer.writeln();

  buffer
    ..writeln('### Install')
    ..writeln()
    ..writeln(
      'Grab `airflow-$tag-arm64-v8a.apk` for any phone from roughly 2017 on. '
      'If that refuses to install, use `airflow-$tag-universal.apk`, which '
      'works on every architecture at about triple the size.',
    )
    ..writeln()
    ..writeln(
      'These builds are signed with the Android debug key, so you\'ll need to '
      'allow installation from unknown sources.',
    );

  stdout.write(buffer);
}
