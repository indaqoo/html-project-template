import gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import browser_sync from 'browser-sync';
import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass'

const sass = gulpSass(nodeSass);
const browserSyncServer = browser_sync.create();
const paths = {
    scripts: {
        src: './src',
        dest: './dist'
    }
}

export const includeHtml = async () => {
    return gulp.src([
        `${paths.scripts.src}/**/*.html`,
        `!${paths.scripts.src}/assets/**/**/*`,
        `!${paths.scripts.src}/components/*.html`,
        `!${paths.scripts.src}/sass/**/**/*`,
    ]).pipe(
        fileinclude({
            prefix: '@@',
            basepath: '@file'
        })
    ).pipe(
        gulp.dest(paths.scripts.dest)
    )
}

const reload = async () => {
    browserSyncServer.reload();
}

const copyAssets = async () => {
    gulp.src([`${paths.scripts.src}/assets/**/*`])
        .pipe(gulp.dest(`${paths.scripts.dest}/assets`));
}

const compileSass = async () => {
    gulp.src(`${paths.scripts.src}/sass/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${paths.scripts.dest}/assets/css`))
}

const buildAndReload = async () => {
    await includeHtml();
    await copyAssets();
    await compileSass();
    reload();
}

export default async () => {
    browserSyncServer.init({
        open: false,
        server: {
            baseDir: paths.scripts.dest
        }
    })

    buildAndReload();

    gulp.watch([
        `${paths.scripts.src}/**/*.html`,
        `${paths.scripts.src}/assets/**/*`,
        `${paths.scripts.src}/sass/**/*.scss`
    ], buildAndReload);
}

