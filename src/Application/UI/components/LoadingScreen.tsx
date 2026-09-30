import React, { useCallback, useEffect, useState } from 'react';
import eventBus from '../EventBus';

type LoadingProps = {};

const LoadingScreen: React.FC<LoadingProps> = () => {
    const [progress, setProgress] = useState(0);
    const [toLoad, setToLoad] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [overlayOpacity, setLoadingOverlayOpacity] = useState(1);
    const [loadingTextOpacity, setLoadingTextOpacity] = useState(1);
    const [startPopupOpacity, setStartPopupOpacity] = useState(0);
    const [firefoxPopupOpacity, setFirefoxPopupOpacity] = useState(0);
    const [webGLErrorOpacity, setWebGLErrorOpacity] = useState(0);

    const [showBiosInfo, setShowBiosInfo] = useState(false);
    const [showLoadingResources, setShowLoadingResources] = useState(false);
    const [doneLoading, setDoneLoading] = useState(false);
    const [webGLError, setWebGLError] = useState(false);
    const [counter, setCounter] = useState(0);
    const [resources] = useState<string[]>([]);
    const [mobileWarning, setMobileWarning] = useState(window.innerWidth < 768);

    const onResize = () => {
        if (window.innerWidth < 768) {
            setMobileWarning(true);
        } else {
            setMobileWarning(false);
        }
    };

    window.addEventListener('resize', onResize);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug')) {
            start();
        } else if (!detectWebGLContext()) {
            setWebGLError(true);
        } else {
            setShowBiosInfo(true);
        }
    }, []);

    useEffect(() => {
        eventBus.on('loadedSource', (data) => {
            setProgress(data.progress);
            setToLoad(data.toLoad);
            setLoaded(data.loaded);
            // Fallout-style memory dump line: address, name, progress
            const address = (0xfac6 + data.loaded * 12)
                .toString(16)
                .toUpperCase();
            resources.push(
                `0x${address} ${data.sourceName.toUpperCase()} ${getDots(
                    data.sourceName
                )} ${Math.round(data.progress * 100)}%`
            );
            if (resources.length > 8) {
                resources.shift();
            }
        });
    }, []);

    useEffect(() => {
        setShowLoadingResources(true);
        setCounter(counter + 1);
    }, [loaded]);

    useEffect(() => {
        if (progress >= 1 && !webGLError) {
            setDoneLoading(true);

            setTimeout(() => {
                setLoadingTextOpacity(0);
                setTimeout(() => {
                    setStartPopupOpacity(1);
                }, 500);
            }, 1000);
        }
    }, [progress]);

    useEffect(() => {
        if (webGLError) {
            setTimeout(() => {
                setWebGLErrorOpacity(1);
            }, 500);
        }
    }, [webGLError]);

    const start = useCallback(() => {
        setLoadingOverlayOpacity(0);
        eventBus.dispatch('loadingScreenDone', {});
        const ui = document.getElementById('ui');
        if (ui) {
            ui.style.pointerEvents = 'none';
        }
    }, []);

    const getDots = (sourceName: string) => {
        return '.'.repeat(Math.max(3, 26 - sourceName.length));
    };

    const getProgressBlocks = () => {
        const filled = Math.round(progress * 10);
        return '■ '.repeat(filled) + '□ '.repeat(10 - filled);
    };

    const getCurrentDate = () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        // add leading zero
        const monthFormatted = month < 10 ? `0${month}` : month;
        const dayFormatted = day < 10 ? `0${day}` : day;
        return `${dayFormatted}/${monthFormatted}/${year}`;
    };

    const detectWebGLContext = () => {
        var canvas = document.createElement('canvas');

        // Get WebGLRenderingContext from canvas element.
        var gl =
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl');
        // Report the result.
        if (gl && gl instanceof WebGLRenderingContext) {
            return true;
        }
        return false;
    };

    return (
        <div
            className="crt"
            style={Object.assign({}, styles.overlay, {
                opacity: overlayOpacity,
                transform: `scale(${overlayOpacity === 0 ? 1.1 : 1})`,
            })}
        >
            {startPopupOpacity === 0 && loadingTextOpacity === 0 && (
                <div style={styles.blinkingContainer}>
                    <span className="blinking-cursor" />
                </div>
            )}
            {!webGLError && (
                <div
                    style={Object.assign({}, styles.overlayText, {
                        opacity: loadingTextOpacity,
                    })}
                >
                    <div
                        style={styles.header}
                        className="loading-screen-header"
                    >
                        <p>JACUSYS INDUSTRIES (TM) TERMLINK PROTOCOL</p>
                        <p>Compilando imagen del sistema operativo</p>
                    </div>
                    <div style={styles.body} className="loading-screen-body">
                        <p className="crt-dim">
                            JACUSYS BIOS V1.0 (C)2026 Cárdenas Urbano
                        </p>
                        <div style={styles.spacer} />
                        {showBiosInfo && (
                            <>
                                <p>Verificando memoria : {14000} OK</p>
                                <p>
                                    Progreso: {getProgressBlocks()}
                                    {Math.round(progress * 100)}%
                                </p>
                                <div style={styles.spacer} />
                                {showLoadingResources ? (
                                    progress === 1 ? (
                                        <p>&gt; Recursos compilados</p>
                                    ) : (
                                        <p className="loading">
                                            &gt; Compilando recursos ({loaded}/
                                            {toLoad === 0 ? '-' : toLoad})
                                        </p>
                                    )
                                ) : (
                                    <p className="loading">&gt; Espere</p>
                                )}
                            </>
                        )}
                        <div style={styles.spacer} />
                        <div style={styles.resourcesLoadingList}>
                            {resources.map((sourceName) => (
                                <p key={sourceName}>{sourceName}</p>
                            ))}
                        </div>
                        {showLoadingResources && doneLoading && (
                            <>
                                <p>&gt; Compilación completa.</p>
                                <p>
                                    &gt; Iniciando{' '}
                                    <b>'Alejandro Urbano Portfolio Showcase'</b>{' '}
                                    V1.0
                                </p>
                            </>
                        )}
                        <div style={styles.spacer} />
                        <p>
                            &gt; <span className="blinking-cursor" />
                        </p>
                    </div>
                    <div
                        style={styles.footer}
                        className="loading-screen-footer"
                    >
                        <p className="crt-dim">
                            Terminal de acceso: visitante
                        </p>
                        <p className="crt-dim">{getCurrentDate()}</p>
                    </div>
                </div>
            )}
            <div
                style={Object.assign({}, styles.popupContainer, {
                    opacity: startPopupOpacity,
                })}
            >
                <div style={styles.startPopup} className="crt-box">
                    <p>Alejandro Urbano Portfolio Showcase</p>
                    {mobileWarning && (
                        <>
                            <br />
                            <p>
                                <b>
                                    Advertencia: esta experiencia se ve mejor
                                </b>
                            </p>
                            <p>
                                <b>en un computador de escritorio o portátil.</b>
                            </p>
                            <br />
                        </>
                    )}
                    <p>
                        &gt; Click para iniciar{'\xa0'}
                        <span className="blinking-cursor" />
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '20px',
                        }}
                    >
                        <div className="bios-start-button" onClick={start}>
                            <p>[ Iniciar ]</p>
                        </div>
                    </div>
                </div>
            </div>
            {webGLError && (
                <div
                    style={Object.assign({}, styles.popupContainer, {
                        opacity: webGLErrorOpacity,
                    })}
                >
                    <div style={styles.startPopup} className="crt-box">
                        <p>
                            <b>Error crítico:</b> no se detectó WebGL
                        </p>
                        <div style={styles.spacer} />
                        <p>Se requiere WebGL para ejecutar este sitio.</p>
                        <p>
                            Actívalo o usa un navegador que lo soporte.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles: StyleSheetCSS = {
    overlay: {
        width: '100%',
        height: '100%',
        display: 'flex',
        transition: 'opacity 0.2s, transform 0.2s',
        MozTransition: 'opacity 0.2s, transform 0.2s',
        WebkitTransition: 'opacity 0.2s, transform 0.2s',
        OTransition: 'opacity 0.2s, transform 0.2s',
        msTransition: 'opacity 0.2s, transform 0.2s',

        transitionTimingFunction: 'ease-in-out',
        MozTransitionTimingFunction: 'ease-in-out',
        WebkitTransitionTimingFunction: 'ease-in-out',
        OTransitionTimingFunction: 'ease-in-out',
        msTransitionTimingFunction: 'ease-in-out',

        boxSizing: 'border-box',
        fontSize: 16,
        letterSpacing: 0.8,
    },

    spacer: {
        height: 16,
    },
    header: {
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
    popupContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    warning: {
        color: 'yellow',
    },
    blinkingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        boxSizing: 'border-box',
        padding: 48,
    },
    startPopup: {
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: 520,
    },
    overlayText: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    body: {
        flex: 1,
        display: 'flex',
        width: '100%',
        boxSizing: 'border-box',
        flexDirection: 'column',
    },
    resourcesLoadingList: {
        display: 'flex',
        paddingBottom: 16,
        flexDirection: 'column',
        // keep the lowercase "x" of the hex addresses
        textTransform: 'none',
    },
    footer: {
        boxSizing: 'border-box',
        width: '100%',
    },
};

export default LoadingScreen;
