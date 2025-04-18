import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

type EventCallback = (data: any) => void;

interface SocketEventHandlers {
    [eventName: string]: EventCallback;
}

interface UseSocketOptions {
    url: string;
    autoConnect?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    reconnectionDelayMax?: number;
    timeout?: number;
    transports?: string[];
    eventHandlers: SocketEventHandlers;
}

interface UseSocketReturn {
    socket: Socket | null;
    status: SocketStatus;
    error: Error | null;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
    emit: <T>(event: string, data?: T) => void;
    on: <T>(event: string, callback: (data: T) => void) => void;
    off: (event: string) => void;
}

/**
 * Custom hook to manage Socket.IO connections
 * 
 * @param options Configuration options for the Socket.IO connection
 * @returns Object with the socket, connection status and methods to interact with the socket
 */
const useSocket = (options: UseSocketOptions): UseSocketReturn => {
    const {
        url,
        autoConnect = true,
        reconnectionAttempts = 10,
        reconnectionDelay = 2000,
        reconnectionDelayMax = 5000,
        timeout = 30000,
        transports = ['websocket', 'polling']
    } = options;

    const [status, setStatus] = useState<SocketStatus>('disconnected');
    const [error, setError] = useState<Error | null>(null);
    const socketRef = useRef<Socket | null>(null);

    // Initialize socket
    const initSocket = useCallback(() => {
        try {
            // Create socket instance with configuration options
            const socket = io(url, {
                autoConnect: false,
                reconnectionAttempts,
                reconnectionDelay,
                reconnectionDelayMax,
                timeout,
                transports,
                auth: {
                    token: localStorage.getItem('token')
                }
            });

            socket.on('connect', () => {
                console.log('Socket connected');
                setStatus('connected');
                setError(null);
            });

            socket.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
                setStatus('error');
                setError(err);
            });

            socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setStatus('disconnected');
            });

            socket.on('reconnect_attempt', (attemptNumber) => {
                console.log(`Socket reconnection attempt ${attemptNumber}`);
                setStatus('connecting');
            });

            socket.on('reconnect_failed', () => {
                console.error('Socket reconnection failed');
                setStatus('error');
                setError(new Error('Reconnection failed after maximum attempts'));
            });

            // Register custom event handlers
            if (options.eventHandlers) {
                Object.entries(options.eventHandlers).forEach(([eventName, callback]) => {
                    socket.on(eventName, callback);
                });
            }

            socketRef.current = socket;

            if (autoConnect) {
                socket.connect();
                setStatus('connecting');
            }

            return socket;
        } catch (err) {
            console.error('Error initializing socket:', err);
            setStatus('error');
            setError(err instanceof Error ? err : new Error('Unknown error initializing socket'));
            return null;
        }
    }, [url, autoConnect, reconnectionAttempts, reconnectionDelay, reconnectionDelayMax, timeout, transports, options.eventHandlers]);

    // Connect to socket
    const connect = useCallback(() => {
        if (!socketRef.current) {
            initSocket();
        } else if (!socketRef.current.connected) {
            socketRef.current.connect();
            setStatus('connecting');
        }
    }, [initSocket]);

    // Disconnect from socket
    const disconnect = useCallback(() => {
        if (socketRef.current?.connected) {
            socketRef.current.disconnect();
            setStatus('disconnected');
        }
    }, []);

    // Emit event
    const emit = useCallback(<T>(event: string, data?: T) => {
        if (!socketRef.current) {
            console.warn('Socket not initialized');
            return false;
        }
        if (!socketRef.current.connected) {
            console.warn(`Socket not connected, cannot emit event ...: ${event}. Trying to reconnect...`);
            socketRef.current.connect();
            return false;
        }
        socketRef.current.emit(event, data);
        return true;
    }, []);

    // Subscribe to event
    const on = useCallback(<T>(event: string, callback: (data: T) => void) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    }, []);

    // Unsubscribe from event
    const off = useCallback((event: string) => {
        if (socketRef.current) {
            socketRef.current.off(event);
        }
    }, []);

    // Initialize socket when component mounts, but don't connect automatically
    useEffect(() => {
        // Solo inicializar el socket, sin conectar automáticamente
        // La conexión se manejará explícitamente con el método connect()
        const socket = initSocket();

        // Limpiar al desmontar
        return () => {
            if (socket?.connected) {
                socket.disconnect();
            }
            socketRef.current = null;
        };
    }, [initSocket]);

    return {
        socket: socketRef.current,
        status,
        error,
        isConnected: status === 'connected',
        connect,
        disconnect,
        emit,
        on,
        off
    };
};

export default useSocket;